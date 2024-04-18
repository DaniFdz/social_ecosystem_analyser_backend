import { type GeneralReport } from '@v1/reports/models/reportsInterface'
import { type Collection, MongoClient } from 'mongodb'

export type Status = 0 | 1

export abstract class ReportsRepository {
  abstract getReports: () => Promise<{ data: GeneralReport[] }>
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

  async getReports (): Promise<{ data: GeneralReport[] }> {
    const result = await this.reportsCollection?.find().toArray()
    let data: GeneralReport[] = []
    if (result != null) {
      data = result?.map((report) => {
        return {
          link: report.link,
          topic: report.topic,
          title: report.title,
          description: report.description,
          view_count: report.view_count,
          like_count: report.like_count,
          urls_reports: report.urls_reports
        } satisfies GeneralReport
      }) as GeneralReport[]
    }
    return { data }
  }

  async addReport (report: GeneralReport): Promise<Status> {
    if (await this.reportsCollection?.findOne({ link: report.link }) != null) {
      console.error(`Report '${report.link}' already exists`)
      return 1
    }

    const result = await this.reportsCollection?.insertOne(report)
    if (result?.insertedId === undefined) {
      console.error(`Error adding report '${report.link}'`)
      return 1
    }

    return 0
  }
}
