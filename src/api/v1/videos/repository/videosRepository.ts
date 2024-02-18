import { type VideoData } from '@v1/videos/repository/videosInterface'
import { type Collection, MongoClient } from 'mongodb'

export type Status = 0 | 1

export abstract class VideosRepository {
  abstract getVideos: () => Promise<{ data: VideoData[] }>
  abstract addVideo: (video: VideoData) => Promise<Status>
  abstract getVideoByName: (id: string) => Promise<VideoData | null>
}

export class MongoDBVideosRepository implements VideosRepository {
  videoCollection: Collection<VideoData> | null = null

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

  async getVideos (): Promise<{ data: VideoData[] }> {
    const result = await this.videoCollection?.find().toArray()

    let data: VideoData[] = []
    if (result !== null) {
      data = result?.map((video) => {
        return {
          topic: video.topic,
          description: video.description,
          title: video.title,
          view_count: video.view_count,
          like_count: video.like_count,
          comment_count: video.comment_count,
          favorite_count: video.favorite_count,
          duration: video.duration,
          comments: video.comments
        }
      }) as VideoData[]
    }
    console.log('Videos retrieved')
    return { data }
  }

  async addVideo (video: VideoData): Promise<Status> {
    if (await this.videoCollection?.findOne({ title: video.title }) !== null) {
      console.error(`Video '${video.title}' already exists`)
      return 1
    }

    const result = await this.videoCollection?.insertOne(video)
    if (result?.insertedId === undefined) {
      console.error(`Error adding video '${video.title}'`)
      return 1
    }

    console.log(`Video '${video.title}' added`)
    return 0
  }

  async getVideoByName (title: string): Promise<VideoData | null> {
    const result = await this.videoCollection
      ?.findOne({ title })
    console.log(result)
    if (result === null) {
      console.error(`Video '${title}' not found`)
      return null
    }
    console.log(`Video '${title}' retrieved`)

    const video: VideoData = {
      topic: result?.topic ?? '',
      description: result?.description ?? '',
      title: result?.title ?? '',
      view_count: result?.view_count ?? 0,
      like_count: result?.like_count ?? 0,
      comment_count: result?.comment_count ?? 0,
      favorite_count: result?.favorite_count ?? 0,
      duration: result?.duration ?? '',
      comments: result?.comments ?? []
    }

    return video
  }
}
