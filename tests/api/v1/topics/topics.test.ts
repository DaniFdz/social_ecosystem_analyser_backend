import { getApp } from '@/app'
import supertest from 'supertest'
import { describe, it, expect, afterEach } from '@jest/globals'
import { type Topic } from '@v1/topics/repository/topicsInterface'
import { MockTopicsRepository } from './topics.mock'
import { MockAuthRepository } from '../auth/auth.mock'

const mockAuthRepository = new MockAuthRepository()
const mockTopicsRepository = new MockTopicsRepository()

const app = getApp(mockAuthRepository, mockTopicsRepository)

const request = supertest(app)

describe('endpoint /api/v1/topics', () => {
  afterEach(() => {
    mockTopicsRepository.resetData()
  })
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

  describe('POST /api/v1/topics', () => {
    it('should return 422 if the request body is not correct', async () => {
      const response = await request.post('/api/v1/topics').send({
        notAValidArgument: 'test'
      })
      expect(response.status).toBe(422)
    })
    it('should return 500 if the topic could not be added', async () => {
      await request.post('/api/v1/topics').send({
        name: 'test'
      })
      const response = await request.post('/api/v1/topics').send({
        name: 'test'
      })
      expect(response.status).toBe(500)
    })
    it('should return 201 if the topic was added', async () => {
      const response = await request.post('/api/v1/topics').send({
        name: 'test'
      })
      expect(response.status).toBe(201)
    })
  })

  describe('PUT /api/v1/topics', () => {
    it('should return 422 if the request body is not correct', async () => {
      const response = await request.put('/api/v1/topics').send({
        notAValidArgument: 'test',
        finished: true
      })
      expect(response.status).toBe(422)
    })
    it('should return 404 if the topic was not found', async () => {
      const response = await request.put('/api/v1/topics').send({
        name: 'test',
        finished: true
      })
      expect(response.status).toBe(404)
    })
    it('should return 200 if the topic was updated', async () => {
      await request.post('/api/v1/topics').send({
        name: 'test'
      })
      const response = await request.put('/api/v1/topics').send({
        name: 'test',
        finished: true
      })
      expect(response.status).toBe(200)
    })
  })

  describe('GET /api/v1/topics/:name', () => {
    it('should return 404 if the topic was not found', async () => {
      const response = await request.get('/api/v1/topics/test')
      expect(response.status).toBe(404)
    })
    it('should return 200 if the topic was found', async () => {
      await request.post('/api/v1/topics').send({
        name: 'test'
      })
      const response = await request.get('/api/v1/topics/test')
      expect(response.status).toBe(200)
    })
  })
})
