import { type Topic } from '@v1/topics/repository/topicsInterface'
import { type Status, type TopicsRepository } from '@v1/topics/repository/topicsRepository'
import { jest } from '@jest/globals'

export class MockTopicsRepository implements TopicsRepository {
  data: Topic[] = []

  constructor () {
    this.data = []
  }

  getTopic: () => Promise<{ data: Topic[] }> = jest.fn(async () => ({ data: this.data }))

  addTopic: (topic: Topic) => Promise<Status> = jest.fn(async (topic: Topic) => {
    if (this.data.find((t) => t.name === topic.name) !== undefined) {
      return 1 as Status
    }
    this.data.push(topic)
    return 0 as Status
  })

  updateTopic: (topic: Topic) => Promise<Status> = jest.fn(async (topic: Topic) => {
    const index = this.data.findIndex((t) => t.name === topic.name)
    if (index === -1) {
      return 1 as Status
    }
    this.data[index] = topic
    return 0 as Status
  })

  getTopicByName: (name: string) => Promise<Topic | null> = jest.fn(async (name: string) => {
    const topic = this.data.find((t) => t.name === name)
    return topic ?? null
  })

  resetData (): void {
    this.data = []
  }
}