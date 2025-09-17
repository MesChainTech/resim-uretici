import { NextResponse } from 'next/server'
import { HealthResponseSchema } from '@/lib/schemas'

export async function GET() {
  const response = {
    status: 'ok' as const,
  }

  // Validate response matches schema
  const validatedResponse = HealthResponseSchema.parse(response)

  return NextResponse.json(validatedResponse, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method POST not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json({ error: 'Method PUT not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method DELETE not allowed' },
    { status: 405 }
  )
}
