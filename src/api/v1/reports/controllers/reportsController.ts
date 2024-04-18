import type { Request, Response } from 'express'
import { type ReportsRepository } from '@v1/reports/repository/reportsRepository'
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
    const data = await this.reportsRepository.getReports()
    res.json(data)
  }

  async addReport (req: Request, res: Response): Promise<void> {
    res.sendStatus(201)
  }
}
