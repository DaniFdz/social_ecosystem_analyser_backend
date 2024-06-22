import type { Request, Response } from 'express'
import { type VideosRepository } from '@v1/videos/repository/videosRepository'
import { type VideoData } from '@v1/videos/models/videosInterface'

export class VideosController {
  videosRepository: VideosRepository

  constructor (videosRepository: VideosRepository) {
    this.videosRepository = videosRepository
  }

  async getVideos (req: Request, res: Response): Promise<void> {
    if (req.role === 'guest') {
      res.sendStatus(401)
      return
    }
    const data = req.query.pageNum != null
      ? await this.videosRepository.getVideos(parseInt(req.query.pageNum as string))
      : await this.videosRepository.getVideos()
    res.json(data)
  }

  async postVideo (req: Request, res: Response): Promise<void> {
    if (req.role === 'guest') {
      res.sendStatus(401)
      return
    }
    const { body } = req
    if (body.id === undefined) {
      res.sendStatus(422)
      return
    }

    const video: VideoData = {
      id: body.id,
      topic: body.topic,
      description: body.description,
      title: body.title,
      view_count: body.view_count,
      like_count: body.like_count,
      comment_count: body.comment_count,
      favorite_count: body.favorite_count,
      duration: body.duration,
      comments: body.comments,
      published_at: body.published_at
    }

    const status = await this.videosRepository.addVideo(video)
    if (status !== 0) {
      res.sendStatus(500)
      return
    }
    res.sendStatus(201)
  }

  async getVideoById (req: Request, res: Response): Promise<void> {
    if (req.role === 'guest') {
      res.sendStatus(401)
      return
    }
    const { id } = req.params
    const video = await this.videosRepository.getVideoById(id)
    if (video === null) {
      res.sendStatus(404)
      return
    }
    res.json(video)
  }
}
