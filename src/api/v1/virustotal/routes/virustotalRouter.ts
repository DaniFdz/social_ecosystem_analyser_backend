/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { VirustotalController } from '@v1/virustotal/controllers/virustotalController'
import { type VirustotalRepository } from '@v1/virustotal/repository/virustotalRepository'
import { noGuests } from '@/middlewares/routes'

export function getVirustotalRouter (virustotalRepository: VirustotalRepository): Router {
  const router = Router()

  const virustotalController = new VirustotalController(virustotalRepository)

  router
    .use(noGuests)
    .get('/', async (req, res) => { await virustotalController.getVirustotalReports(req, res) })
    .get('/url', async (req, res) => { await virustotalController.getVirustotalReportByURL(req, res) })
    .post('/', async (req, res) => { await virustotalController.postVirustotalReport(req, res) })
  return router
}
