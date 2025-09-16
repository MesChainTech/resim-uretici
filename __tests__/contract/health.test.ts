import { describe, expect, it } from '@jest/globals'

describe('GET /api/health', () => {
  it('should return status ok', async () => {
    const response = await fetch('http://localhost:3000/api/health')
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toEqual({ status: 'ok' })
  })

  it('should have correct content type', async () => {
    const response = await fetch('http://localhost:3000/api/health')
    
    expect(response.headers.get('content-type')).toContain('application/json')
  })

  it('should respond within reasonable time', async () => {
    const start = Date.now()
    await fetch('http://localhost:3000/api/health')
    const duration = Date.now() - start
    
    expect(duration).toBeLessThan(1000) // 1 second max
  })
})