import { getApp } from '@/app'
import supertest from 'supertest'
import { describe, it, expect, afterEach, beforeAll } from '@jest/globals'
import { type Topic } from '@v1/topics/models/topicsInterface'
import { MockTopicsRepository } from './topics.mock'
import { MockAuthRepository } from '../auth/auth.mock'
import { MockVideosRepository } from '../videos/videos.mock'
import { MockVirustotalRepository } from '../virustotal/virustotal.mock'
import { MockReportsRepository } from '../reports/reports.mock'

const mockAuthRepository = new MockAuthRepository()
const mockTopicsRepository = new MockTopicsRepository()
const mockVideosRepository = new MockVideosRepository()
const mockVirustotalReporsitory = new MockVirustotalRepository()
const mockReportsRepository = new MockReportsRepository()

const app = getApp(mockAuthRepository, mockTopicsRepository, mockVideosRepository, mockVirustotalReporsitory, mockReportsRepository)

const request = supertest(app)

let adminToken: string

describe('endpoint /api/v1/topics', () => {
  beforeAll(async () => {
    const response = await request.post('/api/v1/auth/register').send({
      username: 'admin',
      password: 'admin123'
    })
    adminToken = `Bearer ${response.body.token}`
  })

  afterEach(() => {
    mockTopicsRepository.resetData()
  })
  describe('GET /api/v1/topics', () => {
    it('should return 200', async () => {
      const response = (await request.get('/api/v1/topics').set('Authorization', adminToken))
      expect(response.status).toBe(200)
    })
    it('should return an array inside data object', async () => {
      const response = await request.get('/api/v1/topics').set('Authorization', adminToken)
      expect(response.body.data).toBeInstanceOf(Array<Topic>)
    })
  })

  describe('POST /api/v1/topics', () => {
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.post('/api/v1/topics').send({
        name: 'test'
      })
      expect(response.status).toBe(401)
    })
    it('should return 422 if the request body is not correct', async () => {
      const response = await request.post('/api/v1/topics').set('Authorization', adminToken).send({
        notAValidArgument: 'test'
      })
      expect(response.status).toBe(422)
    })
    it('should return 406 if the topic is not morally correct :V', async () => {
      const response = await request.post('/api/v1/topics').set('Authorization', adminToken).send({
        name: 'drugs'
      })
      expect(response.status).toBe(406)
    })
    it('should return 500 if the topic could not be added', async () => {
      await request.post('/api/v1/topics').set('Authorization', adminToken).send({
        name: 'test'
      })
      const response = await request.post('/api/v1/topics').set('Authorization', adminToken).send({
        name: 'test'
      })
      expect(response.status).toBe(500)
    })
    it('should return 201 if the topic was added', async () => {
      const response = await request.post('/api/v1/topics').set('Authorization', adminToken).send({
        name: 'test'
      })
      expect(response.status).toBe(201)
    })
  })

  describe('PUT /api/v1/topics', () => {
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.put('/api/v1/topics/test').send({
        name: 'test',
        finished: true,
        next_page_token: '',
        type: 'topic'
      })
      expect(response.status).toBe(401)
    })
    it('should return 422 if the request body is not correct', async () => {
      const response = await request.put('/api/v1/topics/test').set('Authorization', adminToken).send({
        notAValidArgument: 'test',
        finished: true,
        next_page_token: '',
        type: 'topic'
      })
      expect(response.status).toBe(422)
    })
    it('should return 404 if the topic was not found', async () => {
      const response = await request.put('/api/v1/topics/test').set('Authorization', adminToken).send({
        name: 'test',
        finished: true,
        next_page_token: '',
        type: 'topic'
      })
      expect(response.status).toBe(404)
    })
    it('should return 200 if the topic was updated', async () => {
      await request.post('/api/v1/topics').set('Authorization', adminToken).send({
        name: 'test'
      })
      const response = await request.put('/api/v1/topics/test').set('Authorization', adminToken).send({
        name: 'test',
        finished: true,
        next_page_token: '',
        type: 'topic'
      })
      expect(response.status).toBe(200)
      const response2 = await request.put('/api/v1/topics/test').set('Authorization', adminToken).send({
        name: 'test',
        finished: true,
        next_page_token: 'pepe',
        type: 'url'
      })
      expect(response2.status).toBe(200)
    })
  })

  describe('GET /api/v1/topics/:name', () => {
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.get('/api/v1/topics/test')
      expect(response.status).toBe(401)
    })
    it('should return 404 if the topic was not found', async () => {
      const response = await request.get('/api/v1/topics/test').set('Authorization', adminToken)
      expect(response.status).toBe(404)
    })
    it('should return 200 if the topic was found', async () => {
      await request.post('/api/v1/topics').set('Authorization', adminToken).send({
        name: 'test'
      })
      const response = await request.get('/api/v1/topics/test').set('Authorization', adminToken)
      expect(response.status).toBe(200)
    })
    it('should return the topic', async () => {
      await request.post('/api/v1/topics').set('Authorization', adminToken).send({
        name: 'test'
      })
      const response = await request.get('/api/v1/topics/test').set('Authorization', adminToken)
      expect(response.body.name).toBe('test')
      expect(response.body.finished).toBe(false)
      expect(response.body.next_page_token).toBe('')
      expect(response.body.type).toBe('topic')
    })
  })

  describe('DELETE /api/v1/topics/:name', () => {
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.delete('/api/v1/topics/test')
      expect(response.status).toBe(401)
    })
    it('should return 404 if the topic was not found', async () => {
      const response = await request.delete('/api/v1/topics/test').set('Authorization', adminToken)
      expect(response.status).toBe(404)
    })
    it('should return 200 if the topic was deleted', async () => {
      await request.post('/api/v1/topics').set('Authorization', adminToken).send({
        name: 'test'
      })
      const response = await request.delete('/api/v1/topics/test').set('Authorization', adminToken)
      expect(response.status).toBe(200)
    })
  })
})
