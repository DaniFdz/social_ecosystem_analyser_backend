import { type Topic } from '@/api/v1/repository/topicsInterface'

export type Status = 0 | 1

export abstract class TopicsRepository {
  abstract getTopic: () => { data: Topic[] }
  abstract addTopic: (topic: Topic) => Status
  abstract updateTopic: (topic: Topic) => Status
}

export class MongoDBTopicsRepository implements TopicsRepository {
  constructor () {
    const connection = 'mongodb://localhost:27017'

    console.log(`Connecting to ${connection}...`)
  }

  getTopic (): { data: Topic[] } {
    return { data: [] }
  }

  addTopic (topic: Topic): Status {
    return 0
  }

  updateTopic (topic: Topic): Status {
    return 0
  }
}
