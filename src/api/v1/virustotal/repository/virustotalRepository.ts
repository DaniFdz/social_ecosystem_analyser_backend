import { type VirustotalData } from '@v1/virustotal/models/virustotalInterface'
import { type Collection, MongoClient } from 'mongodb'

export type Status = 0 | 1

export abstract class VirustotalRepository {
  abstract getVirustotalReports: () => Promise<{ data: VirustotalData[] }>
  abstract addVirustotalReport: (virustotalReport: VirustotalData) => Promise<Status>
  abstract getVirustotalReportByURL: (id: string) => Promise<VirustotalData | null>
}

export class MongoDBVirustotalRepository implements VirustotalRepository {
  virustotalCollection: Collection<VirustotalData> | null = null

  constructor () {
    const connection = process.env.MONGODB_URI ?? 'mongodb://admin:admin@localhost:27017/'
    const client = new MongoClient(connection)
    const DB_NAME = process.env.DB_NAME ?? 'test'

    client.connect()
      .then((conn) => {
        this.virustotalCollection = conn.db(DB_NAME).collection<VirustotalData>('virustotal')
      }).catch((err) => {
        console.error(err)
      })
  }

  async getVirustotalReports (): Promise<{ data: VirustotalData[] }> {
    const result = await this.virustotalCollection?.find().toArray()

    let data: VirustotalData[] = []
    if (result !== null) {
      data = result as VirustotalData[]
    }
    return { data }
  }

  async addVirustotalReport (virustotalReport: VirustotalData): Promise<Status> {
    if (await this.virustotalCollection?.findOne({ url: virustotalReport.url }) !== null) {
      console.error(`Virustotal Report '${virustotalReport.url}' already exists`)
      return 1
    }

    const result = await this.virustotalCollection?.insertOne(virustotalReport)
    if (result?.insertedId === undefined) {
      console.error(`Error adding virustotal report '${virustotalReport.url}'`)
      return 1
    }

    return 0
  }

  async getVirustotalReportByURL (url: string): Promise<VirustotalData | null> {
    const result = await this.virustotalCollection
      ?.findOne({ url })
    if (result === null) {
      console.error(`Virustotal Report '${url}' not found`)
      return null
    }

    return result as VirustotalData
  }
}
