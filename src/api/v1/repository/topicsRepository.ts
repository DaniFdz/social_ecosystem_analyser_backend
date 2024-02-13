import { type Topic } from '@/api/v1/repository/topicsInterface'

const getDBTopic = (): { data: Topic[] } => {
  return { data: [] }
}

const addDBTopic = (topic: Topic): number => {
  return 0
}

export default {
  getDBTopic,
  addDBTopic
}
