import { type GeneralReport } from '@v1/reports/models/reportsInterface'
import { type Status, type ReportsRepository } from '@v1/reports/repository/reportsRepository'
import { jest } from '@jest/globals'

export class MockReportsRepository implements ReportsRepository {
  data: GeneralReport[] = []

  constructor () {
    this.data = []
  }

  getReportById: (id: string) => Promise<GeneralReport | null> = jest.fn(async (id: string) => {
    const report = this.data.find((report) => report.id === id)
    return report ?? null
  })

  addReport: (report: GeneralReport) => Promise<Status> = jest.fn(async (report: GeneralReport) => {
    if (this.data.find((r) => r.id === report.id) !== undefined) {
      return 1 as Status
    }
    this.data.push(report)
    return 0 as Status
  })

  resetData (): void {
    this.data = []
  }
}
