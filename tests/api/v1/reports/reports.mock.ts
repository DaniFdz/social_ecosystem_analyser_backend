import { type GeneralReport } from '@v1/reports/models/reportsInterface'
import { type Status, type ReportsRepository } from '@v1/reports/repository/reportsRepository'
import { jest } from '@jest/globals'

export class MockReportsRepository implements ReportsRepository {
  data: GeneralReport[] = []

  constructor () {
    this.data = []
  }

  getReports: () => Promise<{ data: GeneralReport[] }> = jest.fn(async () => ({ data: this.data }))

  addReport: (report: GeneralReport) => Promise<Status> = jest.fn(async (report: GeneralReport) => {
    this.data.push(report)
    return 0 as Status
  })

  resetData (): void {
    this.data = []
  }
}
