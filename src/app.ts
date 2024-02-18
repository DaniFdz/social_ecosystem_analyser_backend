import { config } from 'dotenv'
import bodyParser from 'body-parser'
import express, { type Express } from 'express'
import { getTopicsRouter } from '@v1/topics/routes/topicsRouter'
import type { TopicsRepository } from '@v1/topics/repository/topicsRepository'
import type { AuthRepository } from '@v1/auth/repository/authRepository'
import { getAuthRouter } from '@v1/auth/routes/authRoutes'
import { authenticate } from '@/middlewares/authentication'
import { VideosRepository } from './api/v1/videos/repository/videosRepository'
import { getVideosRouter } from './api/v1/videos/routes/videosRouter'

config()

export const getApp = (authRepository: AuthRepository, topicsRepository: TopicsRepository, videosRepository: VideosRepository): Express => {
  const app: Express = express()

  const authRouter = getAuthRouter(authRepository)
  const topicsRouter = getTopicsRouter(topicsRepository)
  const videosRouter = getVideosRouter(videosRepository)

  app.disable('x-powered-by')
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(authenticate)
  app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' })
  })
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/topics', topicsRouter)
  app.use('/api/v1/videos', videosRouter)

  return app
}
