import { getApp } from '@/app'
import supertest from 'supertest'
import { describe, it, expect, afterEach, beforeAll } from '@jest/globals'
import { MockVideosRepository } from '../videos/videos.mock'
import { MockAuthRepository } from '../auth/auth.mock'
import { MockTopicsRepository } from '../topics/topics.mock'
import { MockVirustotalRepository } from './virustotal.mock'
import { MockReportsRepository } from '../reports/reports.mock'
import { type VirustotalData } from '@/api/v1/virustotal/models/virustotalInterface'

const mockAuthRepository = new MockAuthRepository()
const mockTopicsRepository = new MockTopicsRepository()
const mockVideosRepository = new MockVideosRepository()
const mockVirustotalReporsitory = new MockVirustotalRepository()
const mockReportsRepository = new MockReportsRepository()

const app = getApp(mockAuthRepository, mockTopicsRepository, mockVideosRepository, mockVirustotalReporsitory, mockReportsRepository)

const request = supertest(app)

let adminToken: string

describe('endpoint /api/v1/virustotal', () => {
  beforeAll(async () => {
    const response = await request.post('/api/v1/auth/login').send({
      username: 'admin',
      password: 'admin123'
    })
    adminToken = `Bearer ${response.body.token}`
  })

  afterEach(() => {
    mockVideosRepository.resetData()
  })

  describe('GET /api/v1/virustotal', () => {
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.get('/api/v1/virustotal')
      expect(response.status).toBe(401)
    })
    it('should return 200', async () => {
      const response = (await request.get('/api/v1/virustotal').set('Authorization', adminToken))
      expect(response.status).toBe(200)
    })
    it('should return an array inside data object', async () => {
      const response = await request.get('/api/v1/virustotal').set('Authorization', adminToken)
      expect(response.body.data).toBeInstanceOf(Array<VirustotalData>)
    })
  })

  describe('POST /api/v1/virustotal', () => {
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.post('/api/v1/virustotal').send({
        url: 'test'
      })
      expect(response.status).toBe(401)
    })
    it('should return 422 if the request body is not correct', async () => {
      const response = await request.post('/api/v1/virustotal').set('Authorization', adminToken).send({
        notAValidArgument: 'test'
      })
      expect(response.status).toBe(422)
    })
    it('should return 500 if the virustotal report could not be added', async () => {
      await request.post('/api/v1/virustotal').set('Authorization', adminToken).send({
        url: 'test'
      })
      const response = await request.post('/api/v1/virustotal').set('Authorization', adminToken).send({
        url: 'test'
      })
      expect(response.status).toBe(500)
    })
    it('should return 201 if the virustotal report was added', async () => {
      const response = await request.post('/api/v1/virustotal').set('Authorization', adminToken).send({
        first_submission_date: 0,
        last_modification_date: 0,
        last_http_response_content_length: 0,
        tags: ['test'],
        html_meta: {
          test: ['test']
        },
        times_submitted: 0,
        domain: 'string',
        redirection_chain: ['test'],
        trackers: {
          test: [{
            url: 'test',
            timestamp: 0,
            id: 'test'
          }]
        },
        threat_names: ['test'],
        url: 'test2',
        categories: {
          test: 'test'
        },
        last_analysis_stats: {
          test: 0
        },
        reputation: 0,
        last_http_response_code: 0,
        last_http_response_headers: {
          test: 'test'
        }
      })
      expect(response.status).toBe(201)
    })
  })

  describe('GET /api/v1/virustotal/:url', () => {
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.get('/api/v1/virustotal/test')
      expect(response.status).toBe(401)
    })
    it('should return 404 if the virustotal report was not found', async () => {
      const response = await request.get('/api/v1/virustotal/testtest').set('Authorization', adminToken)
      expect(response.status).toBe(404)
    })
    it('should return 200 if the virustotal report was found', async () => {
      await request.post('/api/v1/virustotal').set('Authorization', adminToken).send({
        url: 'test'
      })
      const response = await request.get('/api/v1/virustotal/test').set('Authorization', adminToken)
      expect(response.status).toBe(200)
    })
    it('should return the virustotal report', async () => {
      await request.post('/api/v1/virustotal').set('Authorization', adminToken).send({
        url: 'test'
      })
      const response = await request.get('/api/v1/virustotal/test').set('Authorization', adminToken)
      expect(response.body.url).toBe('test')
    })
  })
})
