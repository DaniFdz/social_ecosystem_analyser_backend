import { type VirustotalData } from '@v1/virustotal/models/virustotalInterface'
import { type Status, type VirustotalRepository } from '@v1/virustotal/repository/virustotalRepository'
import { jest } from '@jest/globals'

export class MockVirustotalRepository implements VirustotalRepository {
  data: VirustotalData[] = []

  constructor () {
    this.data = []
  }

  getVirustotalReports: () => Promise<{ data: VirustotalData[] }> = jest.fn(async () => ({ data: this.data }))

  addVirustotalReport: (virustotalReport: VirustotalData) => Promise<Status> = jest.fn(async (virustotalReport: VirustotalData) => {
    if (this.data.find((t) => t.url === virustotalReport.url) !== undefined) {
      return 1 as Status
    }
    this.data.push(virustotalReport)
    return 0 as Status
  })

  getVirustotalReportByURL: (url: string) => Promise<VirustotalData | null> = jest.fn(async (url: string) => {
    const virustotalReport = this.data.find((t) => t.url === url)
    return virustotalReport ?? null
  })

  resetData (): void {
    this.data = []
  }
}
