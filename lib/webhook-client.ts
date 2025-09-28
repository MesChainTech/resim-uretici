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

      // Check if this is an async workflow response
      if (responseData.message === 'Workflow was started' || responseData.status === 'started') {
        console.log('Async workflow started, returning placeholder response')
        return {
          generated_image: 'WORKFLOW_STARTED', // Placeholder for async workflow
          processing_time: 0,
          metadata: { 
            async: true, 
            workflow_started: true,
            message: responseData.message || 'Workflow started'
          },
          download_url: undefined,
        }
      }

      // Validate response structure
      try {
        return WebhookResponseSchema.parse(responseData)
      } catch (validationError) {
        // If validation fails, return a basic successful response
        console.warn('Webhook response validation failed:', validationError)
        console.log('Response data:', responseData)
        
        // Try to extract image data from various possible fields
        const imageData = responseData.generated_image ||
          responseData.imageUrl ||
          responseData.image_url ||
          responseData.image ||
          responseData.data ||
          responseData.result ||
          responseText || // If response is not JSON, use raw text
          ''
        
        return {
          generated_image: imageData,
          processing_time: responseData.processing_time || 0,
          metadata: responseData.metadata || {},
          download_url: responseData.download_url || responseData.downloadUrl,
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
 * Send webhook request with file upload (FormData)
 */
export async function sendWebhookRequestWithFiles(
  url: string,
  formData: FormData,
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

  let lastError: WebhookError

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'User-Agent': 'SpecKit-ImageGenerator/1.0',
          ...headers,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
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
          response.status >= 500 || response.status === 429
        )
        lastError = error
        continue
      }

      // Check if response is binary (image)
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.startsWith('image/')) {
        // Binary image response
        const imageBuffer = await response.arrayBuffer()
        const base64Image = Buffer.from(imageBuffer).toString('base64')
        const dataUrl = `data:${contentType};base64,${base64Image}`
        
        return {
          generated_image: dataUrl,
          processing_time: 0,
          metadata: { 
            binary_response: true,
            content_type: contentType,
            file_size: imageBuffer.byteLength
          },
          download_url: undefined,
        }
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

      // Check if this is an async workflow response
      if (responseData.message === 'Workflow was started' || responseData.status === 'started') {
        console.log('Async workflow started, returning placeholder response')
        return {
          generated_image: 'WORKFLOW_STARTED', // Placeholder for async workflow
          processing_time: 0,
          metadata: { 
            async: true, 
            workflow_started: true,
            message: responseData.message || 'Workflow started'
          },
          download_url: undefined,
        }
      }

      // Validate response structure
      try {
        return WebhookResponseSchema.parse(responseData)
      } catch (validationError) {
        // If validation fails, return a basic successful response
        console.warn('Webhook response validation failed:', validationError)
        console.log('Response data:', responseData)
        
        // Try to extract image data from various possible fields
        const imageData = responseData.generated_image ||
          responseData.imageUrl ||
          responseData.image_url ||
          responseData.image ||
          responseData.data ||
          responseData.result ||
          responseText || // If response is not JSON, use raw text
          ''
        
        return {
          generated_image: imageData,
          processing_time: responseData.processing_time || 0,
          metadata: responseData.metadata || {},
          download_url: responseData.download_url || responseData.downloadUrl,
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
          'NETWORK_ERROR',
          true
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
 * Send image generation request to n8n webhook with file upload
 */
export async function generateImage(
  webhookUrl: string,
  productImageBuffer: Buffer,
  modelImageBuffer: Buffer,
  category: Category,
  generationId: string,
  callbackUrl?: string,
  options: WebhookRequestOptions = {}
): Promise<WebhookResponse> {
  const formData = new FormData()
  
  // Add files
  formData.append('urun_resmi', new Blob([new Uint8Array(productImageBuffer)], { type: 'image/png' }), 'product.png')
  formData.append('model_resmi', new Blob([new Uint8Array(modelImageBuffer)], { type: 'image/png' }), 'model.png')
  
  // Add other fields
  formData.append('category', category)
  formData.append('generation_id', generationId)
  if (callbackUrl) {
    formData.append('callback_url', callbackUrl)
  }

  return sendWebhookRequestWithFiles(webhookUrl, formData, options)
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
    productImageBuffer: Buffer,
    modelImageBuffer: Buffer,
    category: Category,
    generationId: string,
    callbackUrl?: string,
    options: WebhookRequestOptions = {}
  ): Promise<WebhookResponse> {
    const mergedOptions = { ...this.defaultOptions, ...options }
    return generateImage(
      this.defaultUrl,
      productImageBuffer,
      modelImageBuffer,
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
    timeout: parseInt(process.env.N8N_WEBHOOK_TIMEOUT || WEBHOOK_CONFIG.TIMEOUT.toString()),
    retries: WEBHOOK_CONFIG.RETRY_ATTEMPTS,
    headers: process.env.N8N_API_KEY
      ? { Authorization: `Bearer ${process.env.N8N_API_KEY}` }
      : {},
  })
}
