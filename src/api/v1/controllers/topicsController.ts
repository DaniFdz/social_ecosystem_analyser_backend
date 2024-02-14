import { type Request, type Response } from 'express'
import { type TopicsRepository } from '@/api/v1/repository/topicsRepository'
import { type Topic } from '@/api/v1/repository/topicsInterface'

export class TopicsController {
  topicsRepository: TopicsRepository

  constructor (topicsRepository: TopicsRepository) {
    this.topicsRepository = topicsRepository
  }

  async getTopic (req: Request, res: Response): Promise<void> {
    const data = await this.topicsRepository.getTopic()
    res.json(data)
  }

  async postTopic (req: Request, res: Response): Promise<void> {
    const { body } = req
    if (body.name === undefined) {
      res.sendStatus(422)
      return
    }

    const topic: Topic = {
      name: body.name,
      finished: false
    }

    const status = await this.topicsRepository.addTopic(topic)
    if (status !== 0) {
      res.sendStatus(500)
      return
    }
    res.sendStatus(201)
  }

  async putTopic (req: Request, res: Response): Promise<void> {
    const { body } = req
    if (body.name === undefined) {
      res.sendStatus(422)
      return
    }

    const topic: Topic = {
      name: body.name,
      finished: true
    }

    const status = await this.topicsRepository.updateTopic(topic)
    if (status !== 0) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(200)
  }
}
