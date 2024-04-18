import { type Topic } from '@v1/topics/models/topicsInterface'
import { type Status, type TopicsRepository } from '@v1/topics/repository/topicsRepository'
import { jest } from '@jest/globals'

export class MockTopicsRepository implements TopicsRepository {
  data: Topic[] = []

  constructor () {
    this.data = []
  }

  getTopics: () => Promise<{ data: Topic[] }> = jest.fn(async () => ({ data: this.data }))

  addTopic: (topic: Topic) => Promise<Status> = jest.fn(async (topic: Topic) => {
    if (this.data.find((t) => t.name === topic.name) !== undefined) {
      return 1 as Status
    }
    this.data.push(topic)
    return 0 as Status
  })

  updateTopic: (name: string, topic: Topic) => Promise<Status> = jest.fn(async (name: string, topic: Topic) => {
    if (this.data.find((t) => t.name === name) === undefined) {
      return 1 as Status
    }
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

  deleteTopic: (name: string) => Promise<Status> = jest.fn(async (name: string) => {
    const index = this.data.findIndex((t) => t.name === name)
    if (index === -1) {
      return 1 as Status
    }
    this.data.splice(index, 1)
    return 0 as Status
  })
}
