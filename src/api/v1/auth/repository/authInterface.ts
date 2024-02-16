export type Role = 'admin' | 'user'

export interface User {
  _id?: string
  username: string
  password: string
  role: Role
}
