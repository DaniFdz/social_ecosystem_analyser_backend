import { type Request, type Response } from 'express'
import { type TopicsRepository } from '@/api/v1/repository/topicsRepository'
import { type Topic } from '@/api/v1/repository/topicsInterface'

export class TopicsController {
  topicsRepository: TopicsRepository

  constructor (topicsRepository: TopicsRepository) {
    this.topicsRepository = topicsRepository
  }

  getTopic (req: Request, res: Response): void {
    const data = this.topicsRepository.getTopic()
    res.json(data)
  }

  postTopic (req: Request, res: Response): void {
    const { body } = req
    if (body.name === undefined) {
      res.sendStatus(422)
      return
    }

    const topic: Topic = {
      name: body.name,
      finished: false
    }

    const status = this.topicsRepository.addTopic(topic)
    if (status !== 0) {
      res.sendStatus(500)
      return
    }
    res.sendStatus(201)
  }

  putTopic (req: Request, res: Response): void {
    const { body } = req
    if (body.name === undefined) {
      res.sendStatus(422)
      return
    }

    const topic: Topic = {
      name: body.name,
      finished: true
    }

    const status = this.topicsRepository.updateTopic(topic)
    if (status !== 0) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(200)
  }
}
