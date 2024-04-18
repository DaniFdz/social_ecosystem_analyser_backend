import type { Request, Response } from 'express'
import { type ReportsRepository } from '@v1/reports/repository/reportsRepository'
import { type GeneralReport, type URLReport } from '../models/reportsInterface'
// import { type GeneralReport } from '@v1/reports/models/reportsInterface'

export class ReportsController {
  reportsRepository: ReportsRepository

  constructor (reportsRepository: ReportsRepository) {
    this.reportsRepository = reportsRepository
  }

  async getReports (req: Request, res: Response): Promise<void> {
    if (req.role === 'guest') {
      res.sendStatus(401)
      return
    }
    const videoUrl = req.params.video_url
    const data = await this.reportsRepository.getReportByUrl(videoUrl)
    if (data == null) {
      res.sendStatus(404)
      return
    }
    res.json(data)
  }

  async addReport (req: Request, res: Response): Promise<void> {
    if (req.role === 'guest') {
      res.sendStatus(401)
      return
    }
    if (req.body.link === undefined || req.body.topic === undefined || req.body.title === undefined || req.body.description === undefined || req.body.view_count === undefined || req.body.like_count === undefined || req.body.urls_reports === undefined) {
      res.sendStatus(422)
      return
    }

    const urlsReports: URLReport[] = []
    for (const url of req.body.urls_reports) {
      if (url.redirection_chain === undefined || url.categories === undefined || url.last_analysis_stats === undefined || url.reputation === undefined || url.result === undefined) {
        res.sendStatus(422)
        return
      }
      urlsReports.push(url as URLReport)
    }
    const report: GeneralReport = {
      link: req.body.link,
      topic: req.body.topic,
      title: req.body.title,
      description: req.body.description,
      view_count: req.body.view_count,
      like_count: req.body.like_count,
      urls_reports: urlsReports
    }

    const status = await this.reportsRepository.addReport(report)
    switch (status) {
      case 0:
        res.sendStatus(201)
        break
      case 1:
        res.sendStatus(409)
        break
      case 2:
        res.sendStatus(500)
        break
    }
  }
}
