import { getApp } from '@/app'
import supertest from 'supertest'
import { describe, it, expect, jest } from '@jest/globals'
import { type TopicsRepository } from '@v1/repository/topicsRepository'

const mockRepository = {
  getTopic: jest.fn(),
  addTopic: jest.fn(),
  updateTopic: jest.fn()
} as unknown as TopicsRepository

const app = getApp(mockRepository)

const request = supertest(app)

describe('endpoint /health', () => {
  it('should return 200', async () => {
    const response = await request.get('/health')
    expect(response.status).toBe(200)
  })
  it('should return a message', async () => {
    const response = await request.get('/health')
    expect(response.body.message).toBe('Server is running')
  })
})
