import { type Topic } from '@v1/topics/repository/topicsInterface'
import { type Collection, MongoClient } from 'mongodb'

export type Status = 0 | 1

export abstract class TopicsRepository {
  abstract getTopic: () => Promise<{ data: Topic[] }>
  abstract addTopic: (topic: Topic) => Promise<Status>
  abstract updateTopic: (topic: Topic) => Promise<Status>
  abstract getTopicByName: (name: string) => Promise<Topic | null>
}

export class MongoDBTopicsRepository implements TopicsRepository {
  topicCollection: Collection<Topic> | null = null

  constructor () {
    const connection = process.env.MONGODB_URI ?? 'mongodb://admin:admin@localhost:27017/'
    const client = new MongoClient(connection)
    const DB_NAME = process.env.DB_NAME ?? 'test'

    client.connect()
      .then((conn) => {
        this.topicCollection = conn.db(DB_NAME).collection<Topic>('topics')
      }).catch((err) => {
        console.error(err)
      })
  }

  async getTopic (): Promise<{ data: Topic[] }> {
    const result = await this.topicCollection?.find().toArray()

    let data: Topic[] = []
    if (result !== null) {
      data = result?.map((topic) => {
        return {
          name: topic.name,
          finished: topic.finished
        }
      }) as Topic[]
    }
    console.log('Topics retrieved')
    return { data }
  }

  async addTopic (topic: Topic): Promise<Status> {
    if (await this.topicCollection?.findOne({ name: topic.name }) !== null) {
      console.error(`Topic '${topic.name}' already exists`)
      return 1
    }

    const result = await this.topicCollection?.insertOne(topic)
    if (result?.insertedId === undefined) {
      console.error(`Error adding topic '${topic.name}'`)
      return 1
    }

    console.log(`Topic '${topic.name}' added`)
    return 0
  }

  async updateTopic (topic: Topic): Promise<Status> {
    const result = await this.topicCollection?.updateOne({ name: topic.name }, { $set: topic })
    if (result?.modifiedCount === 0) {
      console.error(`Error updating topic '${topic.name}'`)
      return 1
    }
    console.log(`Topic '${topic.name}' updated`)
    return 0
  }

  async getTopicByName (name: string): Promise<Topic | null> {
    const result = await this.topicCollection
      ?.findOne({ name })
    if (result === null) {
      console.error(`Topic '${name}' not found`)
      return null
    }
    console.log(`Topic '${name}' retrieved`)

    const topic: Topic = {
      name: result?.name ?? '',
      finished: result?.finished ?? false
    }

    return topic
  }
}