export interface VideoData {
  id: string
  topic: string
  title: string
  description: string
  score: number
  view_count: number
  like_count: number
  comment_count: number
  favorite_count: number
  duration: string
  published_at: string
  comments: Comment[]
}

export interface Comment {
  is_author: boolean
  text: string
  score: number
  like_count: number
  published_at: string
}
