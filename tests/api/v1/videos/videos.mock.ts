import { type VideoData } from '@v1/videos/models/videosInterface'
import { type Status, type VideosRepository } from '@v1/videos/repository/videosRepository'
import { jest } from '@jest/globals'

export class MockVideosRepository implements VideosRepository {
  data: VideoData[] = []
  pageSize: number = 100

  constructor () {
    this.data = []
  }

  getVideos: (pageNum?: number) => Promise<{ data: VideoData[] }> = jest.fn(async (pageNum?) => {
    if (pageNum === undefined) {
      return { data: this.data }
    } else {
      return { data: this.data.slice(this.pageSize * (pageNum as number), this.pageSize * (pageNum as number + 1)) }
    }
  })

  addVideo: (video: VideoData) => Promise<Status> = jest.fn(async (video: VideoData) => {
    if (this.data.find((t) => t.title === video.title) !== undefined) {
      return 1 as Status
    }
    this.data.push(video)
    return 0 as Status
  })

  getVideoByName: (title: string) => Promise<VideoData | null> = jest.fn(async (title: string) => {
    const video = this.data.find((t) => t.title === title)
    return video ?? null
  })

  resetData (): void {
    this.data = []
  }
}
