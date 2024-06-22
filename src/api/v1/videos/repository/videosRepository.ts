import { type VideoData } from '@v1/videos/models/videosInterface'
import { type Collection, MongoClient } from 'mongodb'

export type Status = 0 | 1

export abstract class VideosRepository {
  abstract pageSize: number
  abstract getVideos: (pageNum?: number) => Promise<{ data: VideoData[] }>
  abstract addVideo: (video: VideoData) => Promise<Status>
  abstract getVideoById: (id: string) => Promise<VideoData | null>
}

export class MongoDBVideosRepository implements VideosRepository {
  videoCollection: Collection<VideoData> | null = null
  pageSize: number = 100

  constructor () {
    const connection = process.env.MONGODB_URI ?? 'mongodb://admin:admin@localhost:27017/'
    const client = new MongoClient(connection)
    const DB_NAME = process.env.DB_NAME ?? 'test'

    client.connect()
      .then((conn) => {
        this.videoCollection = conn.db(DB_NAME).collection<VideoData>('videos')
      }).catch((err) => {
        console.error(err)
      })
  }

  async getVideos (pageNum?: number): Promise<{ data: VideoData[] }> {
    let result
    if (pageNum === undefined) {
      result = await this.videoCollection?.find().toArray()
    } else {
      result = await this.videoCollection?.find().skip(this.pageSize * pageNum).limit(this.pageSize).toArray()
    }

    let data: VideoData[] = []
    if (result != null) {
      data = result.map((video) => {
        return {
          id: video.id,
          topic: video.topic,
          description: video.description,
          title: video.title,
          view_count: video.view_count,
          like_count: video.like_count,
          comment_count: video.comment_count,
          favorite_count: video.favorite_count,
          duration: video.duration,
          comments: video.comments,
          published_at: video.published_at
        }
      }) as VideoData[]
    }
    return { data }
  }

  async addVideo (video: VideoData): Promise<Status> {
    if (await this.videoCollection?.findOne({ id: video.id }) != null) {
      console.error(`Video '${video.id}' already exists`)
      return 1
    }

    const result = await this.videoCollection?.insertOne(video)
    if (result?.insertedId === undefined) {
      console.error(`Error adding video '${video.id}'`)
      return 1
    }

    return 0
  }

  async getVideoById (id: string): Promise<VideoData | null> {
    const result = await this.videoCollection
      ?.findOne({ id })

    if (result != null) {
      const video: VideoData = {
        id: result.id,
        topic: result.topic,
        description: result.description,
        title: result.title,
        view_count: result.view_count,
        like_count: result.like_count,
        comment_count: result.comment_count,
        favorite_count: result.favorite_count,
        duration: result.duration,
        comments: result.comments,
        published_at: result.published_at
      }

      return video
    }

    return null
  }
}
