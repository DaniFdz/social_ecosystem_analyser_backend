export interface VirustotalData {
  first_submission_date: number
  last_modification_date: number
  last_http_response_content_length: number
  tags: string[]
  html_meta: Record<string, string[]>
  times_submitted: number
  redirection_chain: string[]
  trackers: Record<string, Trackers[]>
  threat_names: string[]
  url: string
  domain: string
  categories: Record<string, string>
  last_analysis_stats: Record<string, number>
  reputation: number
  last_http_response_code: number
  last_http_response_headers: Record<string, string>
}

export interface Trackers {
  url?: string
  timestamp?: number
  id?: string
}
