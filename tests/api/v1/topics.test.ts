import { getApp } from '@/app'
import supertest from 'supertest'
import { describe, it, expect } from '@jest/globals'
import { type Topic } from '@v1/repository/topicsInterface'
import { MockTopicsRepository } from './topics.mock'

const mockTopicsRepository = new MockTopicsRepository()

const app = getApp(mockTopicsRepository)

const request = supertest(app)

describe('GET /api/v1/topics', () => {
  it('should return 200', async () => {
    const response = await request.get('/api/v1/topics')
    expect(response.status).toBe(200)
  })
  it('should return an array inside data object', async () => {
    const response = await request.get('/api/v1/topics')
    expect(response.body.data).toBeInstanceOf(Array<Topic>)
  })
})
