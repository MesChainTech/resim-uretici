import { NextRequest, NextResponse } from 'next/server'
import { createWebhookClient } from '@/lib/webhook-client'

export async function POST(request: NextRequest) {
  try {
    // Test payload
    const testPayload = {
      category: 'eticaret' as const,
      urun_resmi: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent PNG
      model_resmi: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent PNG
      generation_id: 'test-' + Date.now(),
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/callback`,
    }

    console.log('🧪 Testing n8n webhook connection...')
    console.log('📡 Webhook URL:', process.env.N8N_WEBHOOK_URL)
    console.log('🔑 API Key:', process.env.N8N_API_KEY ? 'Set' : 'Not set')
    console.log('⏱️ Timeout:', process.env.N8N_WEBHOOK_TIMEOUT || '300000ms')

    // Create webhook client
    const webhookClient = createWebhookClient()
    
    // Test the connection - Convert base64 strings to Buffer
    const productBuffer = Buffer.from(testPayload.urun_resmi, 'base64')
    const modelBuffer = Buffer.from(testPayload.model_resmi, 'base64')
    
    const response = await webhookClient.generateImage(
      productBuffer,
      modelBuffer,
      testPayload.category,
      testPayload.generation_id,
      testPayload.callback_url
    )

    console.log('✅ n8n webhook test successful!')
    console.log('📊 Response:', {
      generated_image: response.generated_image ? 'Received' : 'Not received',
      processing_time: response.processing_time,
      metadata: response.metadata,
      download_url: response.download_url,
    })

    return NextResponse.json({
      success: true,
      message: 'n8n webhook connection test successful',
      data: {
        webhook_url: process.env.N8N_WEBHOOK_URL,
        api_key_set: !!process.env.N8N_API_KEY,
        timeout: process.env.N8N_WEBHOOK_TIMEOUT || '300000',
        response: {
          generated_image: response.generated_image ? 'Received' : 'Not received',
          processing_time: response.processing_time,
          metadata: response.metadata,
          download_url: response.download_url,
        },
      },
    })

  } catch (error) {
    console.error('❌ n8n webhook test failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'n8n webhook connection test failed',
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        webhook_url: process.env.N8N_WEBHOOK_URL,
        api_key_set: !!process.env.N8N_API_KEY,
        timeout: process.env.N8N_WEBHOOK_TIMEOUT || '300000',
      },
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'n8n webhook test endpoint',
    usage: 'POST to this endpoint to test n8n webhook connection',
    required_env_vars: [
      'N8N_WEBHOOK_URL',
      'N8N_API_KEY',
      'N8N_WEBHOOK_TIMEOUT',
      'NEXT_PUBLIC_APP_URL',
    ],
  })
}