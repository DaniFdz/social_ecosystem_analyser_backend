import { type User } from '@v1/auth/repository/authInterface'
import { type Collection, MongoClient } from 'mongodb'

export type Status = 0 | 1

export abstract class AuthRepository {
  abstract getUserByName: (username: string) => Promise<User | null>
  abstract createUser: (user: User) => Promise<Status>
  abstract updateUser: (username: string, user: User) => Promise<Status>
  abstract deleteUser: (username: string) => Promise<Status>
}

export class MongoDBAuthRepository implements AuthRepository {
  authCollection: Collection<User> | null = null

  constructor () {
    const connection = process.env.MONGODB_URI ?? 'mongodb://admin:admin@localhost:27017/'
    const client = new MongoClient(connection)
    const DB_NAME = process.env.DB_NAME ?? 'test'

    client.connect()
      .then((conn) => {
        this.authCollection = conn.db(DB_NAME).collection<User>('auth')
      }).catch((err) => {
        console.error(err)
      })
  }

  async getUserByName (user: string): Promise<User | null> {
    const userData = await this.authCollection?.findOne({ username: user }) ?? null
    return userData
  }

  async createUser (user: User): Promise<Status> {
    const userExists = await this.authCollection?.findOne({ username: user.username })
    if (userExists !== null) {
      return 1
    }
    const status = await this.authCollection?.insertOne(user)
    if (status === undefined) {
      return 1
    }
    return 0
  }

  async updateUser (username: string, user: User): Promise<Status> {
    if (await this.authCollection?.findOne({ username }) === null) {
      return 1
    }
    const status = await this.authCollection?.updateOne({ username: user.username }, { $set: user })
    if (status === undefined) {
      return 1
    }
    return 0
  }

  async deleteUser (user: string): Promise<Status> {
    const status = await this.authCollection?.deleteOne({ username: user })
    if (status === undefined) {
      return 1
    }
    return 0
  }
}
