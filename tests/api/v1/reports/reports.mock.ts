import { type ReportByTopic, type GeneralReport } from '@v1/reports/models/reportsInterface'
import { type Status, type ReportsRepository } from '@v1/reports/repository/reportsRepository'
import { jest } from '@jest/globals'

export class MockReportsRepository implements ReportsRepository {
  data: GeneralReport[] = []
  dataByTopic: ReportByTopic[] = []

  constructor () {
    this.data = []
  }

  getReportByTopic: (topic: string) => Promise<ReportByTopic | null> = jest.fn(async (topic: string) => {
    const report = this.dataByTopic.find((report) => report.topic === topic)
    return report ?? null
  })

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
