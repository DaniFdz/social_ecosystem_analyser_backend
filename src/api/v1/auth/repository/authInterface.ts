export type Role = 'admin' | 'youtube' | 'guest'

export interface User {
  _id?: string
  username: string
  password: string
  role: Role
}
