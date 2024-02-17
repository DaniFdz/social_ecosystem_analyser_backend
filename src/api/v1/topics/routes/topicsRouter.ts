/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { TopicsController } from '@v1/topics/controllers/topicsController'
import { type TopicsRepository } from '@v1/topics/repository/topicsRepository'

export function getTopicsRouter (topicsRepository: TopicsRepository): Router {
  const router = Router()

  const topicsController = new TopicsController(topicsRepository)

  router
    .get('/', async (req, res) => { await topicsController.getTopic(req, res) })
    .post('/', async (req, res) => { await topicsController.postTopic(req, res) })
    .put('/', async (req, res) => { await topicsController.putTopic(req, res) })
    .get('/:name', async (req, res) => { await topicsController.getTopicByName(req, res) })
  return router
}
