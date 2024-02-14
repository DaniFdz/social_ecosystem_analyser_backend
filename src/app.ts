import express, { type Express } from 'express'
import bodyParser from 'body-parser'
import { getTopicsRouter } from '@/api/v1/routes/topicsRouter'
import { config } from 'dotenv'
import { type TopicsRepository } from './api/v1/repository/topicsRepository'

config()

export const getApp = (topicsRepository: TopicsRepository): Express => {
  const app: Express = express()

  const topicsRouter = getTopicsRouter(topicsRepository)

  app.disable('x-powered-by')
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use('/api/v1/topics', topicsRouter)
  app.get('/checkHealth', (req, res) => {
    res.status(200).json({ message: 'Server is running' })
  })

  return app
}
