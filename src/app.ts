import { config } from 'dotenv'
import bodyParser from 'body-parser'
import express, { type Express } from 'express'
import { getTopicsRouter } from '@v1/topics/routes/topicsRouter'
import type { TopicsRepository } from '@v1/topics/repository/topicsRepository'
import type { AuthRepository } from '@v1/auth/repository/authRepository'
import { getAuthRouter } from '@v1/auth/routes/authRoutes'

config()

export const getApp = (authRepository: AuthRepository, topicsRepository: TopicsRepository): Express => {
  const app: Express = express()

  const authRouter = getAuthRouter(authRepository)
  const topicsRouter = getTopicsRouter(topicsRepository)

  app.disable('x-powered-by')
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/topics', topicsRouter)
  app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' })
  })

  return app
}
