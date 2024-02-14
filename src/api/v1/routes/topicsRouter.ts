/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Router } from 'express'
import { type TopicsRepository } from '@v1/repository/topicsRepository'

const router = Router()


class Router {
  topicsRepository: TopicsRepository
}

router
  .get('/', topicsController.getTopic)
  .post('/', topicsController.postTopic)

export default router
