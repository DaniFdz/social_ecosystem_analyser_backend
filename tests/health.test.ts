import { getApp } from '@/app'
import supertest from 'supertest'
import { describe, it, expect } from '@jest/globals'
import { MockTopicsRepository } from './api/v1/topics/topics.mock'
import { MockAuthRepository } from './api/v1/auth/auth.mock'
import { MockVideosRepository } from './api/v1/videos/videos.mock'
import { MockVirustotalRepository } from './api/v1/virustotal/virustotal.mock'
import { MockReportsRepository } from './api/v1/reports/reports.mock'

const mockAuthRepository = new MockAuthRepository()
const mockTopicsRepository = new MockTopicsRepository()
const mockVideosRepository = new MockVideosRepository()
const mockVirustotalReporsitory = new MockVirustotalRepository()
const mockReportsRepository = new MockReportsRepository()

const app = getApp(mockAuthRepository, mockTopicsRepository, mockVideosRepository, mockVirustotalReporsitory, mockReportsRepository)

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
