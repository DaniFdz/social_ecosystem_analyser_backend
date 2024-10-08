/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { ReportsController } from '@v1/reports/controllers/reportsController'
import { type ReportsRepository } from '@v1/reports/repository/reportsRepository'
import { noGuests } from '@/middlewares/routes'

export function getReportsRouter (reportsRepository: ReportsRepository): Router {
  const router = Router()

  const reportsController = new ReportsController(reportsRepository)

  router
    .get('/:id', async (req, res) => { await reportsController.getReports(req, res) })
    .get('/topic/:topic', async (req, res) => { await reportsController.getTopicReport(req, res) })
    .use(noGuests)
    .post('/', async (req, res) => { await reportsController.addReport(req, res) })
  return router
}
