import { getApp } from '@/app'
import supertest from 'supertest'
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { MockTopicsRepository } from '../topics/topics.mock'
import { MockAuthRepository } from './auth.mock'
import { MockVideosRepository } from '../videos/videos.mock'

const mockTopicsRepository = new MockTopicsRepository()
const mockAuthRepository = new MockAuthRepository()
const mockVideosRepository = new MockVideosRepository()

const app = getApp(mockAuthRepository, mockTopicsRepository, mockVideosRepository)

const request = supertest(app)

describe('endpoint /api/v1/auth', () => {
  afterEach(() => {
    mockAuthRepository.resetData()
  })

  describe('POST /api/v1/auth/register', () => {
    it('should return 422 if the request body is not correct', async () => {
      const response = await request.post('/api/v1/auth/register').send({
        notAValidArgument: 'test'
      })
      expect(response.status).toBe(422)
    })
    it('should return 500 if the user could not be added', async () => {
      await request.post('/api/v1/auth/register').send({
        username: 'test',
        password: 'test'
      })
      const response = await request.post('/api/v1/auth/register').send({
        username: 'test',
        password: 'test'
      })
      expect(response.status).toBe(500)
    })
    it('should return 201', async () => {
      const response = await request.post('/api/v1/auth/register').send({
        username: 'test',
        password: 'test'
      })
      expect(response.status).toBe(201)
    })
    it('should return a token', async () => {
      const response = await request.post('/api/v1/auth/register').send({
        username: 'test',
        password: 'test'
      })
      expect(response.body.token).toBeDefined()
    })
  })

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request.post('/api/v1/auth/register').send({
        username: 'test',
        password: 'test'
      })
    })

    it('should return 422 if the request body is not correct', async () => {
      const response = await request.post('/api/v1/auth/login').send({
        notAValidArgument: 'test'
      })
      expect(response.status).toBe(422)
    })
    it('should return 401 if the user does not exist', async () => {
      const response = await request.post('/api/v1/auth/login').send({
        username: 'wrongUsername',
        password: 'test'
      })
      expect(response.status).toBe(401)
    })
    it('should return 401 if the password is incorrect', async () => {
      const response = await request.post('/api/v1/auth/login').send({
        username: 'test',
        password: 'wrongPassword'
      })
      expect(response.status).toBe(401)
    })
    it('should return 200', async () => {
      const response = await request.post('/api/v1/auth/login').send({
        username: 'test',
        password: 'test'
      })
      expect(response.status).toBe(200)
    })
    it('should return a token', async () => {
      const response = await request.post('/api/v1/auth/login').send({
        username: 'test',
        password: 'test'
      })
      const token = response.body.token
      expect(token).toBeDefined()
    })
  })

  describe('POST /api/v1/auth/getSession', () => {
    beforeEach(async () => {
      await request.post('/api/v1/auth/register').send({
        username: 'test',
        password: 'test'
      })
    })
    it('should return 422 if the request body is not correct', async () => {
      const response = await request.post('/api/v1/auth/getSession').send({
        notAValidArgument: 'test'
      })
      expect(response.status).toBe(422)
    })
    it('should return 401 if the token is not valid', async () => {
      const response = await request.post('/api/v1/auth/getSession').send({
        token: 'wrongToken'
      })
      expect(response.status).toBe(401)
    })
    it('should return 200', async () => {
      const token = (await request.post('/api/v1/auth/login').send({
        username: 'test',
        password: 'test'
      })).body.token
      const response = await request.post('/api/v1/auth/getSession').send({
        token
      })
      expect(response.status).toBe(200)
    })
    it('should return a payload', async () => {
      const token = (await request.post('/api/v1/auth/login').send({
        username: 'test',
        password: 'test'
      })).body.token
      const response = await request.post('/api/v1/auth/getSession').send({
        token
      })
      const body = response.body
      expect(body.id).toBeDefined()
      expect(body.username).toBeDefined()
      expect(body.role).toBeDefined()
    })
  })

  describe('PUT /api/v1/auth/update', () => {
    beforeEach(async () => {
      await request.post('/api/v1/auth/register').send({
        username: 'test',
        password: 'test'
      })
    })
    it('should return 422 if the request body is not correct', async () => {
      const response = await request.put('/api/v1/auth/update').send({
        notAValidArgument: 'test'
      })
      expect(response.status).toBe(422)
    })
    it('should return 400 if the user does not exist', async () => {
      const response = await request.put('/api/v1/auth/update').send({
        username: 'wrongUsername',
        password: 'test',
        newPassword: 'newPassword'
      })
      expect(response.status).toBe(400)
    })
    it('should return 401 if the password is incorrect', async () => {
      const response = await request.put('/api/v1/auth/update').send({
        username: 'test',
        password: 'wrongPassword',
        newPassword: 'newPassword'
      })
      expect(response.status).toBe(401)
    })
    it('should return 200', async () => {
      const response = await request.put('/api/v1/auth/update').send({
        username: 'test',
        password: 'test',
        newPassword: 'newPassword'
      })
      expect(response.status).toBe(200)
    })
  })

  describe('DELETE /api/v1/auth/delete', () => {
    beforeEach(async () => {
      await request.post('/api/v1/auth/register').send({
        username: 'test',
        password: 'test'
      })
    })
    it('should return 422 if the request body is not correct', async () => {
      const response = await request.delete('/api/v1/auth/delete').send({
        notAValidArgument: 'test'
      })
      expect(response.status).toBe(422)
    })
    it('should return 400 if the user does not exist', async () => {
      const response = await request.delete('/api/v1/auth/delete').send({
        username: 'wrongUsername',
        password: 'test'
      })
      expect(response.status).toBe(400)
    })
    it('should return 401 if the password is incorrect', async () => {
      const response = await request.delete('/api/v1/auth/delete').send({
        username: 'test',
        password: 'wrongPassword'
      })
      expect(response.status).toBe(401)
    })
    it('should return 200', async () => {
      const response = await request.delete('/api/v1/auth/delete').send({
        username: 'test',
        password: 'test'
      })
      expect(response.status).toBe(200)
    })
    it('should delete the user', async () => {
      const token = (await request.post('/api/v1/auth/login').send({
        username: 'test',
        password: 'test'
      })).body.token
      await request.delete('/api/v1/auth/delete').send({
        username: 'test',
        password: 'test'
      })
      const response = await request.post('/api/v1/auth/getSession').send({
        token
      })
      expect(response.status).toBe(401)
    })
  })
})
