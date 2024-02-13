import app from '@/app'
import supertest from 'supertest'
import { describe, it, expect } from '@jest/globals'

const request = supertest(app)

describe('GET /api/v1/topics', () => {
  it('should return 200', async () => {
    const response = await request.get('/api/v1/topics')
    expect(response.status).toBe(200)
  })
})
