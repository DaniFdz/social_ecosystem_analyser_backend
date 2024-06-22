import { getApp } from '@/app'
import supertest from 'supertest'
import { describe, it, expect, afterEach, beforeAll } from '@jest/globals'
import { type VideoData } from '@v1/videos/models/videosInterface'
import { MockVideosRepository } from './videos.mock'
import { MockAuthRepository } from '../auth/auth.mock'
import { MockTopicsRepository } from '../topics/topics.mock'
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

describe('endpoint /api/v1/videos', () => {
  beforeAll(async () => {
    const response = await request.post('/api/v1/auth/register').send({
      username: 'admin',
      password: 'admin123'
    })
    adminToken = `Bearer ${response.body.token}`
  })

  afterEach(() => {
    mockVideosRepository.resetData()
  })
  describe('GET /api/v1/videos', () => {
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.get('/api/v1/videos')
      expect(response.status).toBe(401)
    })
    it('should return 200', async () => {
      const response = (await request.get('/api/v1/videos').set('Authorization', adminToken))
      expect(response.status).toBe(200)
    })
    it('should return an array inside data object', async () => {
      const response = await request.get('/api/v1/videos').set('Authorization', adminToken)
      expect(response.body.data).toBeInstanceOf(Array<VideoData>)
    })
    it('should limit the number of videos to 100 and start with element 100', async () => {
      for (let i = 0; i < 250; i++) {
        await request.post('/api/v1/videos').set('Authorization', adminToken).send({
          id: `test${i}`
        })
      }
      const response = await request.get('/api/v1/videos?pageNum=1').set('Authorization', adminToken)
      expect(response.body.data).toBeInstanceOf(Array<VideoData>)
      expect(response.body.data.length).toBe(100)
      expect(response.body.data[0].id).toBe('test100')
    })
  })

  describe('POST /api/v1/videos', () => {
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.post('/api/v1/videos').send({
        id: '123'
      })
      expect(response.status).toBe(401)
    })
    it('should return 422 if the request body is not correct', async () => {
      const response = await request.post('/api/v1/videos').set('Authorization', adminToken).send({
        notAValidArgument: 'test'
      })
      expect(response.status).toBe(422)
    })
    it('should return 500 if the video could not be added', async () => {
      await request.post('/api/v1/videos').set('Authorization', adminToken).send({
        id: '123'
      })
      const response = await request.post('/api/v1/videos').set('Authorization', adminToken).send({
        id: '123'
      })
      expect(response.status).toBe(500)
    })
    it('should return 201 if the video was added', async () => {
      const response = await request.post('/api/v1/videos').set('Authorization', adminToken).send({
        id: '123'
      })
      expect(response.status).toBe(201)
    })
  })

  describe('GET /api/v1/videos/:id', () => {
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.get('/api/v1/videos/123')
      expect(response.status).toBe(401)
    })
    it('should return 404 if the video was not found', async () => {
      const response = await request.get('/api/v1/videos/123').set('Authorization', adminToken)
      expect(response.status).toBe(404)
    })
    it('should return 200 if the video was found', async () => {
      await request.post('/api/v1/videos').set('Authorization', adminToken).send({
        id: '123',
        topic: 'string',
        description: 'string',
        title: 'test',
        view_count: 1,
        like_count: 1,
        comment_count: 1,
        favorite_count: 1,
        duration: 'string',
        comments: [],
        published_at: '00000000'
      })
      const response = await request.get('/api/v1/videos/123').set('Authorization', adminToken)
      expect(response.status).toBe(200)
    })
    it('should return the video', async () => {
      await request.post('/api/v1/videos').set('Authorization', adminToken).send({
        id: '123',
        topic: 'string',
        description: 'string',
        title: 'test',
        view_count: 1,
        like_count: 1,
        comment_count: 1,
        favorite_count: 1,
        duration: 'string',
        comments: [],
        published_at: '00000000'
      })
      const response = await request.get('/api/v1/videos/123').set('Authorization', adminToken)
      expect(response.body.id).toBe('123')
    })
  })
})
