export interface URLReport {
  redirection_chain: string[]
  categories: Record<string, string>
  last_analysis_stats: Record<string, number>
  reputation: number
  result: number
}

export interface GeneralReport {
  link: string
  topic: string
  title: string
  description: string
  view_count: number
  like_count: number
  urls_reports: URLReport[]
}
