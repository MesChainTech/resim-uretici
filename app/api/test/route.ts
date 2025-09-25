import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    // Test authentication
    const { userId } = await auth()
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    return NextResponse.json({
      success: true,
      message: 'API is working',
      data: {
        userId: userId || 'no-user',
        isDevelopment,
        environment: process.env.NODE_ENV,
        clerkKeys: {
          publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set',
          secretKey: process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set'
        },
        webhookUrl: process.env.N8N_WEBHOOK_URL ? 'Set' : 'Not set'
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
