import { describe, expect, it } from '@jest/globals'

describe('POST /api/generate', () => {
  const validPayload = {
    category: 'ecommerce',
    modelImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/', // Sample base64
    productImage:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  }

  it('should require authentication', async () => {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    })

    expect(response.status).toBe(401)
  })

  it('should validate category field', async () => {
    const invalidPayload = { ...validPayload, category: 'invalid' }

    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer valid-token', // Mock auth
      },
      body: JSON.stringify(invalidPayload),
    })

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error.code).toBe('VALIDATION_ERROR')
  })

  it('should require both model and product images', async () => {
    const incompletePayload = {
      category: 'ecommerce',
      modelImage: validPayload.modelImage,
    }

    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer valid-token',
      },
      body: JSON.stringify(incompletePayload),
    })

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error.code).toBe('VALIDATION_ERROR')
  })

  it('should accept valid generation request', async () => {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer valid-token',
      },
      body: JSON.stringify(validPayload),
    })

    expect([200, 202]).toContain(response.status) // Accept or Processing
    const data = await response.json()
    expect(data.success).toBe(true)
    if (data.data) {
      expect(data.data).toHaveProperty('generationId')
    }
  })

  it('should return proper error structure', async () => {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    const data = await response.json()
    expect(data).toHaveProperty('success', false)
    expect(data).toHaveProperty('error')
    expect(data.error).toHaveProperty('code')
    expect(data.error).toHaveProperty('message')
  })
})
