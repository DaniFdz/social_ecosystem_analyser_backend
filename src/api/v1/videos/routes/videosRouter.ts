/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { VideosController } from '@v1/videos/controllers/videosController'
import { type VideosRepository } from '@v1/videos/repository/videosRepository'

export function getVideosRouter (videosRepository: VideosRepository): Router {
  const router = Router()

  const videosController = new VideosController(videosRepository)

  router
    .get('/', async (req, res) => { await videosController.getVideos(req, res) })
    .get('/:title', async (req, res) => { await videosController.getVideoByName(req, res) })
    .post('/', async (req, res) => { await videosController.postVideo(req, res) })
  return router
}
