import { type Topic } from '@v1/repository/topicsInterface'
import { type Status, type TopicsRepository } from '@v1/repository/topicsRepository'
import { jest } from '@jest/globals'

const getTopic = jest.fn(() => ({ data: [] }))
const addTopic = jest.fn(() => 0 as Status)
const updateTopic = jest.fn(() => 0 as Status)

export class MockTopicsRepository implements TopicsRepository {
  getTopic: () => { data: Topic[] } = getTopic
  addTopic: (topic: Topic) => Status = addTopic
  updateTopic: (topic: Topic) => Status = updateTopic
}
