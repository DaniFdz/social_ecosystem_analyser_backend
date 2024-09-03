import type { GeneralReport, ReportByTopic, URLReport } from '@v1/reports/models/reportsInterface'
import { type Collection, MongoClient } from 'mongodb'

export type Status = 0 | 1 | 2

export abstract class ReportsRepository {
  abstract getReportById: (id: string) => Promise<GeneralReport | null>
  abstract addReport: (report: GeneralReport) => Promise<Status>
  abstract getReportByTopic: (topic: string) => Promise<ReportByTopic | null>
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

  async getReportByTopic (topic: string): Promise<ReportByTopic | null> {
    const reports = await this.reportsCollection?.find({ topic }).toArray()
    if (reports == null) {
      console.error(`Report '${topic}' not found`)
      return null
    }

    const avgScore = this.calculateAvgScore(reports.map((report) => report.avg_score))
    const { urlOK, urlNotOK } = this.calculateUrlStatus(reports.map((report) => report.urls_reports))

    const reportTopic: ReportByTopic = {
      light: avgScore < -0.5 ? 'red' : avgScore <= 0.5 ? 'yellow' : 'green',
      topic,
      score: avgScore,
      url_ok: urlOK,
      url_not_ok: urlNotOK,
      videos: reports.map((report) => {
        return {
          id: report.id,
          title: report.title,
          published_at: report.published_at,
          view_count: report.view_count,
          like_count: report.like_count,
          avg_score: report.avg_score
        }
      })
    }
    return reportTopic
  }

  private calculateAvgScore (scores: number[]): number {
    const sum = scores.reduce((acc, score) => acc + score, 0)
    return sum / scores.length
  }

  private calculateUrlStatus (urls: URLReport[][]): { urlOK: number, urlNotOK: number } {
    let urlOK = 0
    let urlNotOK = 0

    if (urls.length === 0) {
      return { urlOK, urlNotOK }
    }

    for (const report of urls.filter(Boolean)) {
      try {
        if (report[0].last_analysis_stats.malicious > 0) {
          urlNotOK++
        } else {
          urlOK++
        }
      } catch (e) {
        console.error(e)
      }
    }
    return { urlOK, urlNotOK }
  }
}
