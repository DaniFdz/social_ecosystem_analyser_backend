/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { ReportsController } from '@v1/reports/controllers/reportsController'
import { type ReportsRepository } from '@v1/reports/repository/reportsRepository'

export function getReportsRouter (reportsRepository: ReportsRepository): Router {
  const router = Router()

  const reportsController = new ReportsController(reportsRepository)

  router
    .get('/:id', async (req, res) => { await reportsController.getReports(req, res) })
    .post('/', async (req, res) => { await reportsController.addReport(req, res) })
  return router
}
