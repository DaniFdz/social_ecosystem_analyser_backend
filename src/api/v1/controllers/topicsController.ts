import { type Request, type Response } from 'express'
import topicsRepository from '@/api/v1/repository/topicsRepository'
import { type Topic } from '@/api/v1/repository/topicsInterface'

const getTopic = (req: Request, res: Response): void => {
  const data = topicsRepository.getDBTopic()
  res.json({ data })
}

const postTopic = (req: Request, res: Response): void => {
  const { body } = req
  if (body.name === undefined) {
    res.status(422)
    return
  }

  const topic: Topic = {
    name: body.name,
    finished: false
  }

  const status = topicsRepository.addDBTopic(topic)
  if (status !== 0) {
    res.status(500)
    return
  }
  res.status(201)
}

export default {
  getTopic,
  postTopic
}
