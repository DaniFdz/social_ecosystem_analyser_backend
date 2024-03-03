import type { Request, Response } from 'express'
import { type TopicsRepository } from '@v1/topics/repository/topicsRepository'
import { type Topic } from '@v1/topics/repository/topicsInterface'

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
    if (req.role === 'guest') {
      res.sendStatus(401)
      return
    }
    const { body } = req
    if (body.name === undefined) {
      res.sendStatus(422)
      return
    }

    const topic: Topic = {
      name: body.name,
      finished: false,
      next_page_token: ''
    }

    const status = await this.topicsRepository.addTopic(topic)
    if (status !== 0) {
      res.sendStatus(500)
      return
    }
    res.sendStatus(201)
  }

  async putTopic (req: Request, res: Response): Promise<void> {
    if (req.role === 'guest') {
      res.sendStatus(401)
      return
    }
    const { body } = req
    if (body.name === undefined || body.finished === undefined || body.next_page_token === undefined) {
      res.sendStatus(422)
      return
    }

    const topic: Topic = {
      name: body.name,
      finished: body.finished,
      next_page_token: body.next_page_token
    }

    const { name } = req.params

    const status = await this.topicsRepository.updateTopic(name, topic)
    if (status !== 0) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(200)
  }

  async getTopicByName (req: Request, res: Response): Promise<void> {
    if (req.role === 'guest') {
      res.sendStatus(401)
      return
    }
    const { name } = req.params
    const topic = await this.topicsRepository.getTopicByName(name)
    if (topic === null) {
      res.sendStatus(404)
      return
    }
    res.json(topic)
  }

  async deleteTopic (req: Request, res: Response): Promise<void> {
    if (req.role === 'guest') {
      res.sendStatus(401)
      return
    }
    const { name } = req.params
    const status = await this.topicsRepository.deleteTopic(name)
    if (status !== 0) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(200)
  }
}
