import { Router } from 'express'
import topicsController from '../controllers/topicsController'

const router = Router()

router
  .get('/', topicsController.getTopic)
  .post('/', topicsController.postTopic)

export default router
