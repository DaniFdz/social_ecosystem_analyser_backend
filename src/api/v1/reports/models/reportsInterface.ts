export interface URLReport {
  first_submission_date: number
  last_modification_date: number
  last_http_response_content_length: number
  tags: string[]
  html_meta: Record<string, string[]>
  times_submitted: number
  redirection_chain: string[]
  url: string
  domain: string
  categories: Record<string, string>
  last_analysis_stats: Record<string, number>
  reputation: number
  last_http_response_code: number
  last_http_response_headers: Record<string, string>
}

export interface GeneralReport {
  id: string
  topic: string
  title: string
  description: string
  published_at: string
  view_count: number
  like_count: number
  avg_score: number
  urls_reports: URLReport[]
}
