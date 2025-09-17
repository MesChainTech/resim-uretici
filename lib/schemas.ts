import { z } from 'zod'

// Categories enum
export const CategoryEnum = z.enum([
  'eticaret',
  'giyim',
  'teknoloji',
  'guzellik',
  'taki',
])

export type Category = z.infer<typeof CategoryEnum>

// Base64 image validation
const base64ImageRegex =
  /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/

export const Base64ImageSchema = z
  .string()
  .regex(
    base64ImageRegex,
    'Geçersiz resim formatı. Base64 kodlu JPEG, PNG veya WebP olmalıdır'
  )
  .refine(data => {
    // Check file size (approximately 10MB in base64)
    // Base64 encoding increases size by ~33%, so 10MB = ~13.3MB base64
    const maxSizeBase64 = 13.3 * 1024 * 1024 // ~13.3MB
    return data.length <= maxSizeBase64
  }, "Resim boyutu 10MB'dan küçük olmalıdır")

// Generation request schema
export const GenerateRequestSchema = z.object({
  category: CategoryEnum,
  modelImage: Base64ImageSchema,
  productImage: Base64ImageSchema,
})

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>

// Generation response schemas
export const GenerateSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    generationId: z.string(),
    generatedImage: z.string(),
    downloadUrl: z.string().url(),
  }),
})

export const GenerateErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.enum([
      'UNAUTHORIZED',
      'VALIDATION_ERROR',
      'WEBHOOK_ERROR',
      'TIMEOUT',
      'INTERNAL_ERROR',
    ]),
    message: z.string(),
  }),
})

export const GenerateResponseSchema = z.union([
  GenerateSuccessResponseSchema,
  GenerateErrorResponseSchema,
])

export type GenerateResponse = z.infer<typeof GenerateResponseSchema>

// Health response schema
export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
})

export type HealthResponse = z.infer<typeof HealthResponseSchema>

// User schema (for database operations)
export const UserSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  imageUrl: z.string().url().optional(),
  tier: z.enum(['FREE', 'PRO', 'ENTERPRISE']).default('FREE'),
  monthlyCredits: z.number().int().min(0).default(5),
  creditsUsed: z.number().int().min(0).default(0),
  creditResetAt: z.date().default(() => new Date()),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type User = z.infer<typeof UserSchema>

// Generation metadata schema (for database operations)
export const GenerationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  category: CategoryEnum,
  modelImageUrl: z.string().optional(),
  productImageUrl: z.string().optional(),
  resultImageUrl: z.string().optional(),
  status: z
    .enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'TIMEOUT'])
    .default('PENDING'),
  error: z.string().optional(),
  processingTime: z.number().int().min(0).optional(),
  webhookPayload: z.record(z.string(), z.any()).optional(),
  webhookResponse: z.record(z.string(), z.any()).optional(),
  createdAt: z.date().default(() => new Date()),
  completedAt: z.date().optional(),
})

export type Generation = z.infer<typeof GenerationSchema>

// Environment variables validation
export const EnvironmentSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),

  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/sign-in'),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/sign-up'),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default('/generate'),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default('/generate'),

  // n8n Webhook
  N8N_WEBHOOK_URL: z.string().url(),
  N8N_WEBHOOK_TIMEOUT: z.string().default('300000'),
  N8N_API_KEY: z.string().optional(),

  // Application
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
})

export type Environment = z.infer<typeof EnvironmentSchema>

// Webhook payload schema for n8n
export const WebhookPayloadSchema = z.object({
  category: CategoryEnum,
  urun_resmi: z.string(), // product image base64 (raw, without data URL prefix)
  model_resmi: z.string(), // model image base64 (raw, without data URL prefix)
  callback_url: z.string().url().optional(),
  generation_id: z.string(),
})

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>

// Webhook response schema from n8n
export const WebhookResponseSchema = z.object({
  generated_image: z.string(),
  download_url: z.string().url().optional(),
  processing_time: z.number().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export type WebhookResponse = z.infer<typeof WebhookResponseSchema>
