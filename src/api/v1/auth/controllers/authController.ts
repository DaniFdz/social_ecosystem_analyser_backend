import { type Request, type Response } from 'express'
import { type AuthRepository } from '@v1/auth/repository/authRepository'
import { type User } from '@v1/auth/models/authInterface'
import { type Payload, hashPassword, generateToken, comparePassword, verifyToken } from '@/lib/cryptography'

export class AuthController {
  authRepository: AuthRepository

  constructor (authRepository: AuthRepository) {
    this.authRepository = authRepository
  }

  async register (req: Request, res: Response): Promise<void> {
    const { body } = req
    if (body.username === undefined || body.password === undefined) {
      res.status(422).json({ message: 'Invalid content' })
      return
    }
    if (body.username.length < 3) {
      res.status(422).json({ message: 'Username must have at least 3 characters' })
      return
    }
    if (body.password.length < 8) {
      res.status(422).json({ message: 'Password must have at least 8 characters' })
      return
    }
    const hashedPassword = await hashPassword(body.password as string)
    const user: User = { username: body.username, password: hashedPassword, role: 'guest' }
    const status = await this.authRepository.createUser(user)
    if (status !== 0) {
      res.status(500).json({ message: 'Username already exists' })
      return
    }

    const payload: Payload = { id: user._id ?? '', username: user.username, role: user.role }
    const token = generateToken(payload)

    res.status(201).json({ token })
  }

  async login (req: Request, res: Response): Promise<void> {
    const { body } = req
    if (body.username === undefined || body.password === undefined) {
      res.status(422).json({ message: 'Invalid content' })
      return
    }
    if (body.username.length < 3) {
      res.status(422).json({ message: 'Username must have at least 3 characters' })
      return
    }
    if (body.password.length < 8) {
      res.status(422).json({ message: 'Password must have at least 8 characters' })
      return
    }
    const data = await this.authRepository.getUserByName(body.username as string) ?? null
    if (data === null) {
      res.status(401).json({ message: 'Invalid username or password' })
      return
    }

    const match = await comparePassword(body.password as string, data.password)
    if (!match) {
      res.status(401).json({ message: 'Invalid username or password' })
      return
    }

    const payload: Payload = { id: data._id ?? '', username: data.username, role: data.role }
    const token = generateToken(payload)
    res.status(200).json({ token })
  }

  async getSession (req: Request, res: Response): Promise<void> {
    const { body } = req
    if (body.token === undefined) {
      res.sendStatus(422)
      return
    }
    const payload = verifyToken(body.token as string)
    if (payload === null) {
      res.sendStatus(401)
      return
    }

    const user = await this.authRepository.getUserByName(payload.username)
    if (user === null) {
      res.sendStatus(401)
      return
    }

    res.status(200).json({ id: user._id, username: user.username, role: user.role })
  }

  async update (req: Request, res: Response): Promise<void> {
    // /api/v1/auth/update/:username
    const { body } = req
    const username = req.params.username

    if (username === undefined || body.password === undefined || body.newPassword === undefined) {
      res.status(422).json({ message: 'Invalid content' })
      return
    }

    if (username.length < 3) {
      res.status(422).json({ message: 'Username must have at least 3 characters' })
      return
    }

    if (body.password.length < 8) {
      res.status(422).json({ message: 'Password must have at least 8 characters' })
      return
    }

    if (body.newPassword.length < 8) {
      res.status(422).json({ message: 'New password must have at least 8 characters' })
      return
    }

    const data = await this.authRepository.getUserByName(username) ?? null
    if (data === null) {
      res.status(401).json({ message: 'Invalid username or password' })
      return
    }
    const valid = await comparePassword(body.password as string, data.password)
    if (!valid) {
      res.status(401).json({ message: 'Invalid username or password' })
      return
    }

    const newHashedPassword = await hashPassword(body.newPassword as string)
    const user: User = { username: data.username, password: newHashedPassword, role: data.role }
    const status = await this.authRepository.updateUser(username, user)
    if (status !== 0) {
      res.status(501).json({ message: 'Internal server error' })
      return
    }

    res.sendStatus(200)
  }

  async delete (req: Request, res: Response): Promise<void> {
    const { body } = req
    if (body.username === undefined || body.password === undefined) {
      res.status(422).json({ message: 'Invalid content' })
      return
    }
    if (body.username.length < 3) {
      res.status(422).json({ message: 'Username must have at least 3 characters' })
      return
    }
    if (body.password.length < 8) {
      res.status(422).json({ message: 'Password must have at least 8 characters' })
      return
    }
    const user = await this.authRepository.getUserByName(body.username as string) ?? null
    if (user === null) {
      res.status(401).json({ message: 'Invalid username or password' })
      return
    }
    const valid = await comparePassword(body.password as string, user.password)
    if (!valid) {
      res.status(401).json({ message: 'Invalid username or password' })
      return
    }

    const status = await this.authRepository.deleteUser(body.username as string)
    if (status !== 0) {
      res.status(500).json({ message: 'Internal server error' })
      return
    }

    res.sendStatus(200)
  }
}
