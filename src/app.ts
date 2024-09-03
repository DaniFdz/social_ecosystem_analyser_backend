import { config } from 'dotenv'
import bodyParser from 'body-parser'
import cors, { type CorsOptions } from 'cors'
import express, { type Express } from 'express'
import { authenticate } from '@/middlewares/authentication'
import type { AuthRepository } from '@v1/auth/repository/authRepository'
import type { TopicsRepository } from '@v1/topics/repository/topicsRepository'
import type { VideosRepository } from '@v1/videos/repository/videosRepository'
import type { VirustotalRepository } from '@v1/virustotal/repository/virustotalRepository'
import type { ReportsRepository } from './api/v1/reports/repository/reportsRepository'
import { getAuthRouter } from '@v1/auth/routes/authRoutes'
import { getTopicsRouter } from '@v1/topics/routes/topicsRouter'
import { getVideosRouter } from '@v1/videos/routes/videosRouter'
import { getVirustotalRouter } from '@v1/virustotal/routes/virustotalRouter'
import { getReportsRouter } from './api/v1/reports/routes/reportsRoutes'

config()

export const getApp = (
  authRepository: AuthRepository,
  topicsRepository: TopicsRepository,
  videosRepository: VideosRepository,
  virustotalRepository: VirustotalRepository,
  reportsRepository: ReportsRepository
): Express => {
  const app: Express = express()

  const authRouter = getAuthRouter(authRepository)
  const topicsRouter = getTopicsRouter(topicsRepository)
  const videosRouter = getVideosRouter(videosRepository)
  const virustotalRouter = getVirustotalRouter(virustotalRepository)
  const reportsRouter = getReportsRouter(reportsRepository)

  const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3001'

  const corsOptions: CorsOptions = {
    origin: CORS_ORIGIN,
    optionsSuccessStatus: 200
  }

  app.use(cors(corsOptions))

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
  app.use('/api/v1/virustotal', virustotalRouter)
  app.use('/api/v1/reports', reportsRouter)

  return app
}
