import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import {
  GenerateRequestSchema,
  GenerateSuccessResponseSchema,
  GenerateErrorResponseSchema,
} from '@/lib/schemas'
import { validateImage, optimizeImage } from '@/lib/image-utils'
import { createWebhookClient } from '@/lib/webhook-client'
import {
  AppError,
  ErrorCode,
  ErrorFactory,
  createErrorNextResponse,
  handleZodError,
  handlePrismaError,
  handleClerkError,
  logError,
} from '@/lib/errors'

const prisma = new PrismaClient()

// Generate a unique ID for the generation
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function POST(request: NextRequest) {
  const requestId = generateId()

  try {
    // 1. Authenticate the user
    const { userId } = await auth()

    if (!userId) {
      throw ErrorFactory.unauthorized('Kimlik doğrulama gerekli')
    }

    // 2. Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      throw ErrorFactory.validation('İstek gövdesinde geçersiz JSON')
    }

    const validationResult = GenerateRequestSchema.safeParse(body)
    if (!validationResult.success) {
      throw handleZodError(validationResult.error)
    }

    const { category, modelImage, productImage } = validationResult.data

    // Convert category to Prisma enum format (uppercase)
    const prismaCategory = category.toUpperCase() as
      | 'ETICARET'
      | 'GIYIM'
      | 'TAKI'
      | 'TEKNOLOJI'
      | 'GUZELLIK'

    // 3. Validate images
    const modelImageValidation = await validateImage(modelImage)
    if (!modelImageValidation.isValid) {
      throw ErrorFactory.validation('Model resmi doğrulama başarısız', {
        errors: modelImageValidation.errors,
      })
    }

    const productImageValidation = await validateImage(productImage)
    if (!productImageValidation.isValid) {
      throw ErrorFactory.validation('Ürün resmi doğrulama başarısız', {
        errors: productImageValidation.errors,
      })
    }

    // 4. Find or create user in database
    let user
    try {
      user = await prisma.user.upsert({
        where: { clerkId: userId },
        update: { updatedAt: new Date() },
        create: {
          clerkId: userId,
          email: '', // Will be updated when we get user info from Clerk
          tier: 'FREE',
          monthlyCredits: 5,
          creditsUsed: 0,
          creditResetAt: new Date(),
        },
      })
    } catch (error) {
      throw handlePrismaError(error)
    }

    // 5. Check user credits (basic credit system without rate limiting)
    if (user.creditsUsed >= user.monthlyCredits) {
      throw new AppError(
        ErrorCode.QUOTA_EXCEEDED,
        'Aylık kredi limitinizi aştınız',
        true,
        { creditsUsed: user.creditsUsed, monthlyCredits: user.monthlyCredits }
      )
    }

    // 6. Optimize images for processing
    const optimizedModelImage = await optimizeImage(modelImage)
    const optimizedProductImage = await optimizeImage(productImage)

    // 7. Create generation record
    const generationId = generateId()
    let generation

    try {
      generation = await prisma.generation.create({
        data: {
          id: generationId,
          userId: user.id,
          category: prismaCategory,
          modelImageUrl: '', // Will store optimized image URL if needed
          productImageUrl: '', // Will store optimized image URL if needed
          status: 'PENDING',
        },
      })
    } catch (error) {
      throw handlePrismaError(error)
    }

    // 8. Send webhook request to n8n
    try {
      const webhookClient = createWebhookClient()

      const webhookResponse = await webhookClient.generateImage(
        optimizedProductImage.base64,
        optimizedModelImage.base64,
        category,
        generationId,
        `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/callback`
      )

      // 9. Update generation with webhook response
      try {
        await prisma.generation.update({
          where: { id: generationId },
          data: {
            status: 'PROCESSING',
            webhookPayload: {
              category,
              productImage:
                optimizedProductImage.base64.substring(0, 100) + '...', // Truncate for storage
              modelImage: optimizedModelImage.base64.substring(0, 100) + '...',
              generationId,
            },
            webhookResponse: {
              generated_image:
                webhookResponse.generated_image.substring(0, 100) + '...',
              processing_time: webhookResponse.processing_time,
              metadata: webhookResponse.metadata,
              download_url: webhookResponse.download_url,
            },
          },
        })
      } catch (error) {
        logError(error as Error, { generationId, userId }, requestId)
        // Don't throw here, we still want to return the result
      }

      // 10. Update user credits
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { creditsUsed: user.creditsUsed + 1 },
        })
      } catch (error) {
        logError(error as Error, { userId, generationId }, requestId)
        // Don't throw here, we still want to return the result
      }

      // 11. Return success response
      const response = {
        success: true as const,
        data: {
          generationId,
          generatedImage: webhookResponse.generated_image,
          downloadUrl: webhookResponse.download_url,
        },
      }

      return NextResponse.json(response, { status: 200 })
    } catch (webhookError) {
      // Update generation status to failed
      try {
        await prisma.generation.update({
          where: { id: generationId },
          data: {
            status: 'FAILED',
            error:
              webhookError instanceof Error
                ? webhookError.message
                : 'Webhook failed',
          },
        })
      } catch (updateError) {
        logError(
          updateError as Error,
          { generationId, originalError: webhookError },
          requestId
        )
      }

      throw ErrorFactory.webhookError('Image generation failed', {
        generationId,
        error:
          webhookError instanceof Error
            ? webhookError.message
            : 'Unknown error',
      })
    }
  } catch (error) {
    logError(
      error as Error,
      { requestId, userId: request.headers.get('x-user-id') },
      requestId
    )

    if (error instanceof AppError) {
      return createErrorNextResponse(error, requestId)
    }

    // Handle unexpected errors
    return createErrorNextResponse(
      ErrorFactory.internal('An unexpected error occurred'),
      requestId
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Handle unsupported methods
export async function GET() {
  return createErrorNextResponse(
    new AppError(ErrorCode.METHOD_NOT_ALLOWED, 'Method GET not allowed', true)
  )
}

export async function PUT() {
  return createErrorNextResponse(
    new AppError(ErrorCode.METHOD_NOT_ALLOWED, 'Method PUT not allowed', true)
  )
}

export async function DELETE() {
  return createErrorNextResponse(
    new AppError(
      ErrorCode.METHOD_NOT_ALLOWED,
      'Method DELETE not allowed',
      true
    )
  )
}
