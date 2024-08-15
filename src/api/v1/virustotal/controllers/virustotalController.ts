import type { Request, Response } from 'express'
import { type VirustotalRepository } from '@v1/virustotal/repository/virustotalRepository'
import { type VirustotalData } from '@v1/virustotal/models/virustotalInterface'

export class VirustotalController {
  virustotalRepository: VirustotalRepository

  constructor (virustotalRepository: VirustotalRepository) {
    this.virustotalRepository = virustotalRepository
  }

  async getVirustotalReports (req: Request, res: Response): Promise<void> {
    const data = await this.virustotalRepository.getVirustotalReports()
    res.json(data)
  }

  async postVirustotalReport (req: Request, res: Response): Promise<void> {
    const { body } = req
    if (body.url === undefined) {
      res.sendStatus(422)
      return
    }

    const virustotalReport: VirustotalData = body

    const status = await this.virustotalRepository.addVirustotalReport(virustotalReport)
    if (status !== 0) {
      res.sendStatus(500)
      return
    }
    res.sendStatus(201)
  }

  async getVirustotalReportByURL (req: Request, res: Response): Promise<void> {
    const { url } = req.params
    const virustotalReport = await this.virustotalRepository.getVirustotalReportByURL(url)
    if (virustotalReport === null) {
      res.sendStatus(404)
      return
    }
    res.status(200).json(virustotalReport)
  }
}
