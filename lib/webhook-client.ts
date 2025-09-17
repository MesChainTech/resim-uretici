import {
  WebhookPayloadSchema,
  WebhookResponseSchema,
  CategoryEnum,
} from './schemas'
import { extractBase64Data } from './image-utils'
import { z } from 'zod'

// Webhook configuration
export const WEBHOOK_CONFIG = {
  TIMEOUT: 5 * 60 * 1000, // 5 minutes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second base delay
  MAX_RETRY_DELAY: 10000, // 10 seconds max delay
} as const

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>
export type WebhookResponse = z.infer<typeof WebhookResponseSchema>
export type Category = z.infer<typeof CategoryEnum>

export interface WebhookRequestOptions {
  timeout?: number
  retries?: number
  headers?: Record<string, string>
}

export interface WebhookError extends Error {
  status?: number
  code?: string
  retryable?: boolean
}

/**
 * Custom error class for webhook operations
 */
export class WebhookRequestError extends Error implements WebhookError {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public retryable: boolean = false
  ) {
    super(message)
    this.name = 'WebhookRequestError'
  }
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateDelay(
  attempt: number,
  baseDelay: number = WEBHOOK_CONFIG.RETRY_DELAY
): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt)
  const jitter = Math.random() * 0.1 * exponentialDelay // 10% jitter
  return Math.min(exponentialDelay + jitter, WEBHOOK_CONFIG.MAX_RETRY_DELAY)
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: any): boolean {
  // Network errors are retryable
  if (
    error.code === 'ECONNRESET' ||
    error.code === 'ENOTFOUND' ||
    error.code === 'ETIMEDOUT'
  ) {
    return true
  }

  // HTTP status codes that are retryable
  if (error.status) {
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504]
    return retryableStatusCodes.includes(error.status)
  }

  return false
}

/**
 * Validate webhook URL
 */
export function validateWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * Send webhook request with retry logic
 */
export async function sendWebhookRequest(
  url: string,
  payload: WebhookPayload,
  options: WebhookRequestOptions = {}
): Promise<WebhookResponse> {
  const {
    timeout = WEBHOOK_CONFIG.TIMEOUT,
    retries = WEBHOOK_CONFIG.RETRY_ATTEMPTS,
    headers = {},
  } = options

  // Validate URL
  if (!validateWebhookUrl(url)) {
    throw new WebhookRequestError(
      'Invalid webhook URL',
      400,
      'INVALID_URL',
      false
    )
  }

  // Validate payload
  try {
    WebhookPayloadSchema.parse(payload)
  } catch (error) {
    throw new WebhookRequestError(
      `Invalid webhook payload: ${error instanceof Error ? error.message : 'Unknown error'}`,
      400,
      'INVALID_PAYLOAD',
      false
    )
  }

  let lastError: WebhookError

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SpecKit-ImageGenerator/1.0',
          ...headers,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        const error = new WebhookRequestError(
          `Webhook request failed: ${response.status} ${response.statusText} - ${errorText}`,
          response.status,
          'HTTP_ERROR',
          isRetryableError({ status: response.status })
        )

        if (!error.retryable || attempt === retries) {
          throw error
        }

        lastError = error
        await sleep(calculateDelay(attempt))
        continue
      }

      // Parse response
      const responseText = await response.text()
      let responseData: any

      try {
        responseData = JSON.parse(responseText)
      } catch {
        // If response is not JSON, wrap it in an object
        responseData = {
          message: responseText,
          status: 'success',
        }
      }

      // Validate response structure
      try {
        return WebhookResponseSchema.parse(responseData)
      } catch (validationError) {
        // If validation fails, return a basic successful response
        console.warn('Webhook response validation failed:', validationError)
        return {
          generated_image:
            responseData.generated_image ||
            responseData.imageUrl ||
            responseData.image_url ||
            '',
          processing_time: responseData.processing_time || 0,
          metadata: responseData.metadata || {},
        }
      }
    } catch (error: any) {
      // Handle fetch errors
      if (error.name === 'AbortError') {
        lastError = new WebhookRequestError(
          'Webhook request timed out',
          408,
          'TIMEOUT',
          true
        )
      } else if (error instanceof WebhookRequestError) {
        lastError = error
      } else {
        lastError = new WebhookRequestError(
          `Network error: ${error.message}`,
          0,
          error.code || 'NETWORK_ERROR',
          isRetryableError(error)
        )
      }

      // Don't retry if it's the last attempt or error is not retryable
      if (!lastError.retryable || attempt === retries) {
        throw lastError
      }

      // Wait before retrying
      if (attempt < retries) {
        await sleep(calculateDelay(attempt))
      }
    }
  }

  // If we get here, all retries failed
  throw lastError!
}

/**
 * Send image generation request to n8n webhook
 */
export async function generateImage(
  webhookUrl: string,
  productImage: string,
  modelImage: string,
  category: Category,
  generationId: string,
  callbackUrl?: string,
  options: WebhookRequestOptions = {}
): Promise<WebhookResponse> {
  const payload: WebhookPayload = {
    category,
    urun_resmi: extractBase64Data(productImage),
    model_resmi: extractBase64Data(modelImage),
    generation_id: generationId,
    callback_url: callbackUrl,
  }

  return sendWebhookRequest(webhookUrl, payload, options)
}

/**
 * Create a webhook client with default configuration
 */
export class WebhookClient {
  private defaultUrl: string
  private defaultOptions: WebhookRequestOptions

  constructor(defaultUrl: string, defaultOptions: WebhookRequestOptions = {}) {
    this.defaultUrl = defaultUrl
    this.defaultOptions = defaultOptions
  }

  /**
   * Send a webhook request using the client's default configuration
   */
  async send(
    payload: WebhookPayload,
    options: WebhookRequestOptions = {}
  ): Promise<WebhookResponse> {
    const mergedOptions = { ...this.defaultOptions, ...options }
    return sendWebhookRequest(this.defaultUrl, payload, mergedOptions)
  }

  /**
   * Generate an image using the client's default configuration
   */
  async generateImage(
    productImage: string,
    modelImage: string,
    category: Category,
    generationId: string,
    callbackUrl?: string,
    options: WebhookRequestOptions = {}
  ): Promise<WebhookResponse> {
    const mergedOptions = { ...this.defaultOptions, ...options }
    return generateImage(
      this.defaultUrl,
      productImage,
      modelImage,
      category,
      generationId,
      callbackUrl,
      mergedOptions
    )
  }

  /**
   * Update the default webhook URL
   */
  setDefaultUrl(url: string): void {
    if (!validateWebhookUrl(url)) {
      throw new WebhookRequestError(
        'Invalid webhook URL',
        400,
        'INVALID_URL',
        false
      )
    }
    this.defaultUrl = url
  }

  /**
   * Update the default options
   */
  setDefaultOptions(options: WebhookRequestOptions): void {
    this.defaultOptions = { ...this.defaultOptions, ...options }
  }

  /**
   * Get the current default URL
   */
  getDefaultUrl(): string {
    return this.defaultUrl
  }

  /**
   * Get the current default options
   */
  getDefaultOptions(): WebhookRequestOptions {
    return { ...this.defaultOptions }
  }
}

/**
 * Create a webhook client instance with environment configuration
 */
export function createWebhookClient(): WebhookClient {
  const webhookUrl = process.env.N8N_WEBHOOK_URL

  if (!webhookUrl) {
    throw new Error('N8N_WEBHOOK_URL environment variable is required')
  }

  return new WebhookClient(webhookUrl, {
    timeout: WEBHOOK_CONFIG.TIMEOUT,
    retries: WEBHOOK_CONFIG.RETRY_ATTEMPTS,
    headers: {
      Authorization: process.env.N8N_WEBHOOK_AUTH_TOKEN
        ? `Bearer ${process.env.N8N_WEBHOOK_AUTH_TOKEN}`
        : undefined,
    }.Authorization
      ? { Authorization: `Bearer ${process.env.N8N_WEBHOOK_AUTH_TOKEN}` }
      : {},
  })
}
