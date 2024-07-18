import type { GeneralReport, URLReport } from '@v1/reports/models/reportsInterface'
import { type Collection, MongoClient } from 'mongodb'

export type Status = 0 | 1 | 2

export abstract class ReportsRepository {
  abstract getReportById: (id: string) => Promise<GeneralReport | null>
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

  async getReportById (id: string): Promise<GeneralReport | null> {
    const result = await this.reportsCollection?.findOne({ id })
    if (result == null) {
      console.error(`Report '${id}' not found`)
      return null
    }

    const topic: GeneralReport = {
      id: result.id,
      topic: result.topic,
      title: result.title,
      description: result.description,
      published_at: result.published_at,
      view_count: result.view_count,
      like_count: result.like_count,
      avg_score: result.avg_score,
      urls_reports: result.urls_reports.map((url) => {
        return {
          first_submission_date: url.first_submission_date,
          last_modification_date: url.last_modification_date,
          last_http_response_content_length: url.last_http_response_content_length,
          tags: url.tags,
          html_meta: url.html_meta,
          times_submitted: url.times_submitted,
          redirection_chain: url.redirection_chain,
          url: url.url,
          domain: url.domain,
          categories: url.categories,
          last_analysis_stats: url.last_analysis_stats,
          reputation: url.reputation,
          last_http_response_code: url.last_http_response_code,
          last_http_response_headers: url.last_http_response_headers
        } satisfies URLReport
      })
    } satisfies GeneralReport

    return topic
  }

  async addReport (report: GeneralReport): Promise<Status> {
    if (await this.reportsCollection?.findOne({ id: report.id }) != null) {
      console.error(`Report '${report.id}' already exists`)
      return 1
    }

    const result = await this.reportsCollection?.insertOne(report)
    if (result?.insertedId === undefined) {
      console.error(`Error adding report '${report.id}'`)
      return 2
    }

    return 0
  }
}
