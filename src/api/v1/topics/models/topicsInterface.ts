export interface Topic {
  name: string
  finished: boolean
  next_page_token: string
  type: 'topic' | 'url'
}
