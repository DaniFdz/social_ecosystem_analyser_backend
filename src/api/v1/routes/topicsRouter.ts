import { Router } from 'express'
import { TopicsController } from '@/api/v1/controllers/topicsController'
import { type TopicsRepository } from '@/api/v1/repository/topicsRepository'

export function getTopicsRouter (topicsRepository: TopicsRepository): Router {
  const router = Router()

  const topicsController = new TopicsController(topicsRepository)

  router
    .get('/', (req, res) => { topicsController.getTopic(req, res) })
    .post('/', (req, res) => { topicsController.postTopic(req, res) })
    .put('/', (req, res) => { topicsController.putTopic(req, res) })
  return router
}
