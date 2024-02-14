import { type Topic } from '@v1/repository/topicsInterface'
import { type Status, type TopicsRepository } from '@v1/repository/topicsRepository'
import { jest } from '@jest/globals'

export class MockTopicsRepository implements TopicsRepository {
  data: Topic[] = []

  constructor () {
    this.data = []
  }

  getTopic: () => { data: Topic[] } = jest.fn(() => ({ data: this.data }))

  addTopic: (topic: Topic) => Status = jest.fn((topic: Topic) => {
    if (this.data.find((t) => t.name === topic.name) !== undefined) {
      return 1 as Status
    }
    this.data.push(topic)
    return 0 as Status
  })

  updateTopic: (topic: Topic) => Status = jest.fn((topic: Topic) => {
    const index = this.data.findIndex((t) => t.name === topic.name)
    if (index === -1) {
      return 1 as Status
    }
    this.data[index] = topic
    return 0 as Status
  })

  resetData (): void {
    this.data = []
  }
}
