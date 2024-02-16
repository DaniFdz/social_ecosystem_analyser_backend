import type { User } from '@v1/auth/repository/authInterface'
import type { AuthRepository, Status } from '@v1/auth/repository/authRepository'
import { jest } from '@jest/globals'

export class MockAuthRepository implements AuthRepository {
  users: User[] = []

  constructor () {
    this.users = []
  }

  resetData = (): void => {
    this.users = []
  }

  getUserByName = jest.fn(async (username: string) => {
    const user = this.users.find((user) => user.username === username) ?? null
    return user
  })

  createUser = jest.fn(async (user: User) => {
    let newId = '0'
    if (this.users.length !== 0) {
      if (this.users.find((u) => u.username === user.username) !== undefined) {
        return 1
      }
      newId = (parseInt(this.users[this.users.length - 1]._id ?? '0') + 1).toString()
    }
    user._id = newId
    this.users.push(user)
    return 0
  })

  updateUser = jest.fn(async (user: User) => {
    const index = this.users.findIndex((u) => u.username === user.username)
    if (index === -1) {
      return 1
    }
    this.users[index] = user
    return 0
  })

  deleteUser: (username: string) => Promise<Status> = jest.fn(async (username: string) => {
    const index = this.users.findIndex((u) => u.username === username)
    if (index === -1) {
      return 1
    }
    this.users.splice(index, 1)
    return 0
  })
}
