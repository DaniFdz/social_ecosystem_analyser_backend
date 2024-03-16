import { getApp } from '@/app'
import supertest from 'supertest'
import { describe, it, expect, afterEach, beforeAll } from '@jest/globals'
import { type VideoData } from '@v1/videos/repository/videosInterface'
import { MockVideosRepository } from './videos.mock'
import { MockAuthRepository } from '../auth/auth.mock'
import { MockTopicsRepository } from '../topics/topics.mock'
import { MockVirustotalRepository } from '../virustotal/virustotal.mock'

const mockAuthRepository = new MockAuthRepository()
const mockTopicsRepository = new MockTopicsRepository()
const mockVideosRepository = new MockVideosRepository()
const mockVirustotalReporsitory = new MockVirustotalRepository()

const app = getApp(mockAuthRepository, mockTopicsRepository, mockVideosRepository, mockVirustotalReporsitory)

const request = supertest(app)

let token: string

describe('endpoint /api/v1/videos', () => {
  beforeAll(async () => {
    const response = await request.post('/api/v1/auth/register').send({
      username: 'test',
      password: 'testtest'
    })
    token = `Bearer ${response.body.token}`
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
      const response = (await request.get('/api/v1/videos').set('Authorization', token))
      expect(response.status).toBe(200)
    })
    it('should return an array inside data object', async () => {
      const response = await request.get('/api/v1/videos').set('Authorization', token)
      expect(response.body.data).toBeInstanceOf(Array<VideoData>)
    })
  })

  describe('POST /api/v1/videos', () => {
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.post('/api/v1/videos').send({
        title: 'test'
      })
      expect(response.status).toBe(401)
    })
    it('should return 422 if the request body is not correct', async () => {
      const response = await request.post('/api/v1/videos').set('Authorization', token).send({
        notAValidArgument: 'test'
      })
      expect(response.status).toBe(422)
    })
    it('should return 500 if the video could not be added', async () => {
      await request.post('/api/v1/videos').set('Authorization', token).send({
        title: 'test'
      })
      const response = await request.post('/api/v1/videos').set('Authorization', token).send({
        title: 'test'
      })
      expect(response.status).toBe(500)
    })
    it('should return 201 if the video was added', async () => {
      const response = await request.post('/api/v1/videos').set('Authorization', token).send({
        title: 'test'
      })
      expect(response.status).toBe(201)
    })
  })

  describe('GET /api/v1/videos/:title', () => {
    it('should return 401 if the user is not authenticated', async () => {
      const response = await request.get('/api/v1/videos/test')
      expect(response.status).toBe(401)
    })
    it('should return 404 if the video was not found', async () => {
      const response = await request.get('/api/v1/videos/test').set('Authorization', token)
      expect(response.status).toBe(404)
    })
    it('should return 200 if the video was found', async () => {
      await request.post('/api/v1/videos').set('Authorization', token).send({
        topic: 'string',
        description: 'string',
        title: 'test',
        view_count: 1,
        like_count: 1,
        comment_count: 1,
        favorite_count: 1,
        duration: 'string',
        comments: []
      })
      const response = await request.get('/api/v1/videos/test').set('Authorization', token)
      expect(response.status).toBe(200)
    })
    it('should return the video', async () => {
      await request.post('/api/v1/videos').set('Authorization', token).send({
        topic: 'string',
        description: 'string',
        title: 'test',
        view_count: 1,
        like_count: 1,
        comment_count: 1,
        favorite_count: 1,
        duration: 'string',
        comments: []
      })
      const response = await request.get('/api/v1/videos/test').set('Authorization', token)
      expect(response.body.title).toBe('test')
    })
  })
})
