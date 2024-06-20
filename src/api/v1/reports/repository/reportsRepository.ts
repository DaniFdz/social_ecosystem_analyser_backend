import type { GeneralReport, URLReport } from '@v1/reports/models/reportsInterface'
import { type Collection, MongoClient } from 'mongodb'

export type Status = 0 | 1 | 2

export abstract class ReportsRepository {
  abstract getReportByUrl: (url: string) => Promise<GeneralReport | null>
  abstract addReport: (report: GeneralReport) => Promise<Status>
}

export class MongoDBReportsRepository implements ReportsRepository {
  reportsCollection: Collection<GeneralReport> | null = null

  constructor () {
    const connection = process.env.MONGODB_URI ?? 'mongodb://admin:admin@localhost:27017/'
    const client = new MongoClient(connection)
    const DB_NAME = process.env.DB_NAME ?? 'test'

    client.connect()
      .then((conn) => {
        this.reportsCollection = conn.db(DB_NAME).collection<GeneralReport>('reports')
      }).catch((err) => {
        console.error(err)
      })
  }

  async getReportByUrl (url: string): Promise<GeneralReport | null> {
    const result = await this.reportsCollection?.findOne({ link: url })
    if (result == null) {
      console.error(`URL '${url}' not found`)
      return null
    }

    const topic: GeneralReport = {
      link: result.link,
      topic: result.topic,
      title: result.title,
      description: result.description,
      published_at: result.published_at,
      view_count: result.view_count,
      like_count: result.like_count,
      urls_reports: result.urls_reports.map((url) => {
        return {
          redirection_chain: url.redirection_chain,
          categories: url.categories,
          last_analysis_stats: url.last_analysis_stats,
          reputation: url.reputation,
          result: url.result
        } satisfies URLReport
      })
    } satisfies GeneralReport

    return topic
  }

  async addReport (report: GeneralReport): Promise<Status> {
    if (await this.reportsCollection?.findOne({ link: report.link }) != null) {
      console.error(`Report '${report.link}' already exists`)
      return 1
    }

    const result = await this.reportsCollection?.insertOne(report)
    if (result?.insertedId === undefined) {
      console.error(`Error adding report '${report.link}'`)
      return 2
    }

    return 0
  }
}
