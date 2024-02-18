export interface VideoData {
  topic: string
  description: string
  title: string
  view_count: number
  like_count: number
  comment_count: number
  favorite_count: number
  duration: string
  comments: Comment[]
}

export interface Comment {
  is_author: boolean
  text: string
  like_count: number
}
