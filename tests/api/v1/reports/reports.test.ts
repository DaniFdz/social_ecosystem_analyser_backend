import { getApp } from '@/app'
import supertest from 'supertest'
import { describe, it, expect, afterEach, beforeAll, beforeEach } from '@jest/globals'
import { MockTopicsRepository } from '../topics/topics.mock'
import { MockAuthRepository } from '../auth/auth.mock'
import { MockVideosRepository } from '../videos/videos.mock'
import { MockVirustotalRepository } from '../virustotal/virustotal.mock'
import { MockReportsRepository } from './reports.mock'

const mockAuthRepository = new MockAuthRepository()
const mockTopicsRepository = new MockTopicsRepository()
const mockVideosRepository = new MockVideosRepository()
const mockVirustotalReporsitory = new MockVirustotalRepository()
const mockReportsRepository = new MockReportsRepository()

const app = getApp(mockAuthRepository, mockTopicsRepository, mockVideosRepository, mockVirustotalReporsitory, mockReportsRepository)

const request = supertest(app)

let adminToken: string

describe('endpoint /api/v1/reports', () => {
  beforeAll(async () => {
    const response = await request.post('/api/v1/auth/register').send({
      username: 'admin',
      password: 'admin123'
    })
    adminToken = `Bearer ${response.body.token}`
  })

  afterEach(() => {
    mockReportsRepository.resetData()
  })
  describe('GET /api/v1/reports/:video_url', () => {
    beforeEach(async () => {
      await request.post('/api/v1/reports').set('Authorization', adminToken).send({
        id: '123',
        topic: 'test',
        title: 'test',
        description: 'test',
        view_count: 0,
        like_count: 0,
        urls_reports: []
      })
    })
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.get('/api/v1/reports/test')
      expect(response.status).toBe(401)
    })
    it('should return 404 if the video_url is not found', async () => {
      const response = await request.get('/api/v1/reports/doesntexist').set('Authorization', adminToken)
      expect(response.status).toBe(404)
    })
    it('should return 200 if the user is authenticated and the id exists', async () => {
      const response = await request.get('/api/v1/reports/123').set('Authorization', adminToken)
      expect(response.status).toBe(200)
    })
  })
  describe('POST /api/v1/reports', () => {
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.post('/api/v1/reports').send({
        id: '123',
        topic: 'test',
        title: 'test',
        description: 'test',
        published_at: 'test',
        view_count: 0,
        like_count: 0,
        urls_report: []
      })
      expect(response.status).toBe(401)
    })
    it('should return 422 if the request body is missing a field', async () => {
      const response = await request.post('/api/v1/reports').set('Authorization', adminToken).send({
        id: '123',
        topic: 'test',
        title: 'test',
        view_count: 0,
        like_count: 0,
        urls_reports: []
      })
      expect(response.status).toBe(422)
    })
    it('should return 201 if the request body is correct', async () => {
      const response = await request.post('/api/v1/reports').set('Authorization', adminToken).send({
        id: '123',
        topic: 'test',
        title: 'test',
        description: 'test',
        published_at: 'test',
        view_count: 0,
        like_count: 0,
        urls_reports: []
      })
      expect(response.status).toBe(201)
    })
    it('it should return 409 if the id already exists', async () => {
      await request.post('/api/v1/reports').set('Authorization', adminToken).send({
        id: '123',
        topic: 'test',
        title: 'test',
        description: 'test',
        published_at: 'test',
        view_count: 0,
        like_count: 0,
        urls_reports: []
      })
      const response = await request.post('/api/v1/reports').set('Authorization', adminToken).send({
        id: '123',
        topic: 'test',
        title: 'test',
        description: 'test',
        published_at: 'test',
        view_count: 0,
        like_count: 0,
        urls_reports: []
      })
      expect(response.status).toBe(409)
    })
  })
})
