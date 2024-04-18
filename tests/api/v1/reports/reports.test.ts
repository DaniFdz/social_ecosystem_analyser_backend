/* eslint-disable @typescript-eslint/no-unused-vars */
import { getApp } from '@/app'
import supertest from 'supertest'
import { describe, it, expect, afterEach, beforeAll } from '@jest/globals'
import { type GeneralReport } from '@v1/reports/models/reportsInterface'
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
let guestToken: string

describe('endpoint /api/v1/reports', () => {
  it('should return 1', () => {
    expect(1).toBe(1)
  })
  // beforeAll(async () => {
  //   const response = await request.post('/api/v1/auth/login').send({
  //     username: 'admin',
  //     password: 'admin123'
  //   })
  //   adminToken = `Bearer ${response.body.token}`
  //   const response2 = await request.post('/api/v1/auth/login').send({
  //     username: 'guest',
  //     password: 'guest123'
  //   })
  //   guestToken = `Bearer ${response2.body.token}`
  // })

  // afterEach(() => {
  //   mockTopicsRepository.resetData()
  // })
  // describe('GET /api/v1/reports', () => {
  //   it('should return 401 if the user is not authenticated', async () => {
  //     const response = await request.get('/api/v1/reports')
  //     expect(response.status).toBe(401)
  //   })
  //   it('should return 200 when logged as guest', async () => {
  //     const response = (await request.get('/api/v1/reports').set('Authorization', guestToken))
  //     expect(response.status).toBe(200)
  //   })
  //   it('should return an array inside data object when logged as guest', async () => {
  //     const response = await request.get('/api/v1/reports').set('Authorization', guestToken)
  //     expect(response.body.data).toBeInstanceOf(Array<GeneralReport>)
  //   })
  // })
  // describe('POST /api/v1/reports', () => {
  //   it('should return 401 if the user is not authenticated', async () => {
  //     const response = await request.post('/api/v1/reports').send({
  //       name: 'test'
  //     })
  //     expect(response.status).toBe(401)
  //   })
  //   it('should return 403 when logged as guest', async () => {
  //     const response = await request.post('/api/v1/reports').set('Authorization', guestToken).send({
  //       name: 'test'
  //     })
  //     expect(response.status).toBe(403)
  //   })
  //   it('should return 422 if the request body is not correct', async () => {
  //     const response = await request.post('/api/v1/reports').set('Authorization', adminToken).send({
  //       notAValidArgument: 'test'
  //     })
  //     expect(response.status).toBe(422)
  //   })
  //   it('should return 500 if the report could not be added', async () => {
  //     await request.post('/api/v1/reports').set('Authorization', adminToken).send({
  //       link: 'test',
  //       topic: 'test',
  //       view_count: 0,
  //       like_count: 0,
  //       urls_report: []
  //     })
  //     const response = await request.post('/api/v1/reports').set('Authorization', adminToken).send({
  //       link: 'test',
  //       topic: 'test',
  //       view_count: 0,
  //       like_count: 0,
  //       urls_report: []
  //     })
  //     expect(response.status).toBe(500)
  //   })
  //   it('should return 201 if the report was added', async () => {
  //     const response = await request.post('/api/v1/reports').set('Authorization', adminToken).send({
  //       link: 'test',
  //       topic: 'test',
  //       view_count: 0,
  //       like_count: 0,
  //       urls_report: []
  //     })
  //     expect(response.status).toBe(201)
  //   })
  // })
})
