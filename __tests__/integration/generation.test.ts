import { describe, expect, it, beforeEach } from '@jest/globals'

describe('Image Generation Flow Integration', () => {
  const mockAuthHeaders = {
    'Authorization': 'Bearer mock-clerk-token',
    'Content-Type': 'application/json'
  }

  const validBase64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='

  beforeEach(() => {
    // Reset any previous state
    localStorage.clear()
  })

  it('should complete full generation flow successfully', async () => {
    const generationPayload = {
      category: 'ecommerce',
      modelImage: validBase64Image,
      productImage: validBase64Image
    }

    // Start generation
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: mockAuthHeaders,
      body: JSON.stringify(generationPayload)
    })

    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('generationId')
    
    // If immediate response, check for generated image
    if (data.data.generatedImage) {
      expect(data.data.generatedImage).toMatch(/^data:image\/(png|jpeg);base64,/)
      expect(data.data).toHaveProperty('downloadUrl')
    }
  })

  it('should handle webhook timeout gracefully', async () => {
    // Mock a slow webhook response
    const generationPayload = {
      category: 'technology',
      modelImage: validBase64Image,
      productImage: validBase64Image,
      _mockTimeout: true // Test flag
    }

    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: mockAuthHeaders,
      body: JSON.stringify(generationPayload)
    })

    expect(response.status).toBe(504)
    
    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error.code).toBe('TIMEOUT')
    expect(data.error.message).toContain('Generation is taking longer than expected')
  })

  it('should handle webhook errors properly', async () => {
    const generationPayload = {
      category: 'fashion',
      modelImage: validBase64Image,
      productImage: validBase64Image,
      _mockError: true // Test flag
    }

    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: mockAuthHeaders,
      body: JSON.stringify(generationPayload)
    })

    expect(response.status).toBe(500)
    
    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error.code).toBe('WEBHOOK_ERROR')
    expect(data.error.message).toContain('Image generation service is temporarily unavailable')
  })

  it('should validate all category types', async () => {
    const categories = ['ecommerce', 'fashion', 'jewelry', 'technology', 'beauty']
    
    for (const category of categories) {
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: mockAuthHeaders,
        body: JSON.stringify({
          category,
          modelImage: validBase64Image,
          productImage: validBase64Image
        })
      })

      expect([200, 202]).toContain(response.status)
      
      const data = await response.json()
      expect(data.success).toBe(true)
    }
  })

  it('should prevent duplicate submissions', async () => {
    const generationPayload = {
      category: 'jewelry',
      modelImage: validBase64Image,
      productImage: validBase64Image
    }

    // Start first generation
    const firstResponse = fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: mockAuthHeaders,
      body: JSON.stringify(generationPayload)
    })

    // Immediately start second generation (should be prevented)
    const secondResponse = fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: mockAuthHeaders,
      body: JSON.stringify(generationPayload)
    })

    const [first, second] = await Promise.all([firstResponse, secondResponse])
    
    expect(first.status).toBe(200)
    expect(second.status).toBe(429) // Too Many Requests
    
    const secondData = await second.json()
    expect(secondData.error.code).toBe('RATE_LIMITED')
  })

  it('should handle malformed webhook responses', async () => {
    const generationPayload = {
      category: 'beauty',
      modelImage: validBase64Image,
      productImage: validBase64Image,
      _mockMalformed: true // Test flag
    }

    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: mockAuthHeaders,
      body: JSON.stringify(generationPayload)
    })

    expect(response.status).toBe(500)
    
    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error.code).toBe('WEBHOOK_ERROR')
  })

  it('should track generation metadata', async () => {
    const generationPayload = {
      category: 'ecommerce',
      modelImage: validBase64Image,
      productImage: validBase64Image
    }

    const startTime = Date.now()
    
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: mockAuthHeaders,
      body: JSON.stringify(generationPayload)
    })

    const endTime = Date.now()
    const data = await response.json()
    
    if (data.success && data.data) {
      // Check if generation ID follows expected format
      expect(data.data.generationId).toMatch(/^[a-z0-9]+$/)
      
      // Processing time should be reasonable
      const processingTime = endTime - startTime
      expect(processingTime).toBeLessThan(300000) // 5 minutes max
    }
  })
})