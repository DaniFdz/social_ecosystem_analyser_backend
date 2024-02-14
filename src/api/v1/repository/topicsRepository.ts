import { type Topic } from '@v1/repository/topicsInterface'

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
    console.log('Getting topics from MongoDB...')
    return { data: [] }
  }

  addTopic (topic: Topic): Status {
    console.log('Adding topic to MongoDB...')
    return 0
  }

  updateTopic (topic: Topic): Status {
    console.log('Updating topic in MongoDB...')
    return 0
  }
}
