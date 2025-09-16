import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

/**
 * Standard error codes for the application
 */
export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // External service errors
  WEBHOOK_ERROR = 'WEBHOOK_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  TIMEOUT = 'TIMEOUT',

  // File processing errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UNSUPPORTED_FILE_TYPE = 'UNSUPPORTED_FILE_TYPE',
  IMAGE_PROCESSING_ERROR = 'IMAGE_PROCESSING_ERROR',

  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',

  // Generic errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * HTTP status codes mapping
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

/**
 * Error code to HTTP status mapping
 */
const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  [ErrorCode.UNAUTHORIZED]: HTTP_STATUS.UNAUTHORIZED,
  [ErrorCode.FORBIDDEN]: HTTP_STATUS.FORBIDDEN,
  [ErrorCode.INVALID_TOKEN]: HTTP_STATUS.UNAUTHORIZED,
  [ErrorCode.VALIDATION_ERROR]: HTTP_STATUS.BAD_REQUEST,
  [ErrorCode.INVALID_INPUT]: HTTP_STATUS.BAD_REQUEST,
  [ErrorCode.MISSING_REQUIRED_FIELD]: HTTP_STATUS.BAD_REQUEST,
  [ErrorCode.WEBHOOK_ERROR]: HTTP_STATUS.BAD_GATEWAY,
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: HTTP_STATUS.BAD_GATEWAY,
  [ErrorCode.TIMEOUT]: HTTP_STATUS.GATEWAY_TIMEOUT,
  [ErrorCode.FILE_TOO_LARGE]: HTTP_STATUS.UNPROCESSABLE_ENTITY,
  [ErrorCode.UNSUPPORTED_FILE_TYPE]: HTTP_STATUS.UNPROCESSABLE_ENTITY,
  [ErrorCode.IMAGE_PROCESSING_ERROR]: HTTP_STATUS.UNPROCESSABLE_ENTITY,
  [ErrorCode.DATABASE_ERROR]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  [ErrorCode.RECORD_NOT_FOUND]: HTTP_STATUS.NOT_FOUND,
  [ErrorCode.DUPLICATE_RECORD]: HTTP_STATUS.CONFLICT,
  [ErrorCode.INTERNAL_ERROR]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  [ErrorCode.NOT_FOUND]: HTTP_STATUS.NOT_FOUND,
  [ErrorCode.METHOD_NOT_ALLOWED]: HTTP_STATUS.METHOD_NOT_ALLOWED,
  [ErrorCode.UNKNOWN_ERROR]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
}

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly context?: Record<string, any>

  constructor(
    code: ErrorCode,
    message: string,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message)

    this.name = 'AppError'
    this.code = code
    this.statusCode =
      ERROR_STATUS_MAP[code] || HTTP_STATUS.INTERNAL_SERVER_ERROR
    this.isOperational = isOperational
    this.context = context

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

/**
 * Create standardized error responses for API routes
 */
export interface ErrorResponse {
  success: false
  error: {
    code: ErrorCode
    message: string
    details?: any
    timestamp: string
    requestId?: string
  }
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: AppError | Error,
  requestId?: string
): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.context,
        timestamp: new Date().toISOString(),
        requestId,
      },
    }
  }

  // Handle unknown errors
  return {
    success: false,
    error: {
      code: ErrorCode.UNKNOWN_ERROR,
      message: 'An unexpected error occurred',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString(),
      requestId,
    },
  }
}

/**
 * Create a NextResponse with error formatting
 */
export function createErrorNextResponse(
  error: AppError | Error,
  requestId?: string
): NextResponse {
  const errorResponse = createErrorResponse(error, requestId)
  const statusCode =
    error instanceof AppError
      ? error.statusCode
      : HTTP_STATUS.INTERNAL_SERVER_ERROR

  return NextResponse.json(errorResponse, { status: statusCode })
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: ZodError): AppError {
  const details = error.issues.map((err: any) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }))

  return new AppError(ErrorCode.VALIDATION_ERROR, 'Validation failed', true, {
    details,
  })
}

/**
 * Handle Prisma errors
 */
export function handlePrismaError(error: any): AppError {
  // Prisma error codes
  switch (error.code) {
    case 'P2002':
      return new AppError(
        ErrorCode.DUPLICATE_RECORD,
        'A record with this information already exists',
        true,
        { field: error.meta?.target }
      )

    case 'P2025':
      return new AppError(
        ErrorCode.RECORD_NOT_FOUND,
        'The requested record was not found',
        true
      )

    case 'P2003':
      return new AppError(
        ErrorCode.VALIDATION_ERROR,
        'Foreign key constraint failed',
        true,
        { field: error.meta?.field_name }
      )

    default:
      return new AppError(
        ErrorCode.DATABASE_ERROR,
        'Database operation failed',
        true,
        { prismaCode: error.code }
      )
  }
}

/**
 * Handle Clerk authentication errors
 */
export function handleClerkError(error: any): AppError {
  if (error.status === 401) {
    return new AppError(ErrorCode.UNAUTHORIZED, 'Authentication required')
  }

  if (error.status === 403) {
    return new AppError(ErrorCode.FORBIDDEN, 'Access denied')
  }

  return new AppError(
    ErrorCode.EXTERNAL_SERVICE_ERROR,
    'Authentication service error',
    true,
    { clerkError: error.message }
  )
}

/**
 * Handle file upload errors
 */
export function createFileError(
  type: 'size' | 'type' | 'processing',
  details?: Record<string, any>
): AppError {
  switch (type) {
    case 'size':
      return new AppError(
        ErrorCode.FILE_TOO_LARGE,
        'File size exceeds the maximum allowed limit',
        true,
        details
      )

    case 'type':
      return new AppError(
        ErrorCode.UNSUPPORTED_FILE_TYPE,
        'File type is not supported',
        true,
        details
      )

    case 'processing':
      return new AppError(
        ErrorCode.IMAGE_PROCESSING_ERROR,
        'Failed to process the image',
        true,
        details
      )

    default:
      return new AppError(
        ErrorCode.UNKNOWN_ERROR,
        'File processing error',
        true,
        details
      )
  }
}

/**
 * Log errors with proper formatting
 */
export function logError(
  error: Error,
  context?: Record<string, any>,
  requestId?: string
): void {
  const logData: any = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    requestId,
    context,
  }

  if (error instanceof AppError) {
    logData.code = error.code
    logData.statusCode = error.statusCode
    logData.isOperational = error.isOperational
    logData.errorContext = error.context
  }

  console.error('Application Error:', JSON.stringify(logData, null, 2))
}

/**
 * Async error handler wrapper for API routes
 */
export function asyncErrorHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      logError(error as Error)
      throw error
    }
  }
}

/**
 * Create specific error types for common scenarios
 */
export const ErrorFactory = {
  unauthorized: (message: string = 'Authentication required') =>
    new AppError(ErrorCode.UNAUTHORIZED, message),

  forbidden: (message: string = 'Access denied') =>
    new AppError(ErrorCode.FORBIDDEN, message),

  validation: (message: string, details?: any) =>
    new AppError(ErrorCode.VALIDATION_ERROR, message, true, details),

  notFound: (resource: string = 'Resource') =>
    new AppError(ErrorCode.RECORD_NOT_FOUND, `${resource} not found`),

  webhookError: (message: string, details?: any) =>
    new AppError(ErrorCode.WEBHOOK_ERROR, message, true, details),

  timeout: (service: string = 'External service') =>
    new AppError(ErrorCode.TIMEOUT, `${service} request timed out`),

  internal: (message: string = 'Internal server error', details?: any) =>
    new AppError(ErrorCode.INTERNAL_ERROR, message, false, details),
}

/**
 * Error boundary helper for React components (to be used in error.tsx)
 */
export interface ErrorBoundaryProps {
  error: Error
  reset: () => void
}

export function getErrorDisplayMessage(error: Error): string {
  if (error instanceof AppError) {
    switch (error.code) {
      case ErrorCode.UNAUTHORIZED:
        return 'Please sign in to continue'
      case ErrorCode.FILE_TOO_LARGE:
        return 'The uploaded file is too large. Please try a smaller file.'
      case ErrorCode.UNSUPPORTED_FILE_TYPE:
        return 'This file type is not supported. Please use JPEG, PNG, or WebP format.'
      case ErrorCode.WEBHOOK_ERROR:
        return 'Image generation service is temporarily unavailable. Please try again later.'
      default:
        return error.message
    }
  }

  return 'Something went wrong. Please try again.'
}
