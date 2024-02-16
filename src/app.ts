import { config } from 'dotenv'
import bodyParser from 'body-parser'
import express, { type Express } from 'express'
import { getTopicsRouter } from '@v1/topics/routes/topicsRouter'
import { type TopicsRepository } from '@v1/topics/repository/topicsRepository'

config()

export const getApp = (topicsRepository: TopicsRepository): Express => {
  const app: Express = express()

  const topicsRouter = getTopicsRouter(topicsRepository)

  app.disable('x-powered-by')
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use('/api/v1/topics', topicsRouter)
  app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' })
  })

  return app
}
