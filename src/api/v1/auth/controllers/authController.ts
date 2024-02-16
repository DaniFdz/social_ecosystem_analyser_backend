import { type Request, type Response } from 'express'
import { type AuthRepository } from '@v1/auth/repository/authRepository'
import { type User } from '@v1/auth/repository/authInterface'
import { type Payload, hashPassword, generateToken, comparePassword, verifyToken } from '@/lib/cryptography'

export class AuthController {
  authRepository: AuthRepository

  constructor (authRepository: AuthRepository) {
    this.authRepository = authRepository
  }

  async register (req: Request, res: Response): Promise<void> {
    const { body } = req
    if (body.username === undefined || body.password === undefined) {
      res.sendStatus(422)
      return
    }
    const hashedPassword = await hashPassword(body.password as string)
    const user: User = { username: body.username, password: hashedPassword, role: 'user' }
    const status = await this.authRepository.createUser(user)
    if (status !== 0) {
      res.sendStatus(500)
      return
    }

    const payload: Payload = { id: user._id ?? '', username: user.username, role: user.role }
    const token = generateToken(payload)

    res.status(201).json({ token })
  }

  async login (req: Request, res: Response): Promise<void> {
    const { body } = req
    if (body.username === undefined || body.password === undefined) {
      res.sendStatus(422)
      return
    }
    const data = await this.authRepository.getUserByName(body.username as string) ?? null
    if (data === null) {
      res.sendStatus(401)
      return
    }

    const match = await comparePassword(body.password as string, data.password)
    if (!match) {
      res.sendStatus(401)
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
    if (user._id !== payload.id) {
      res.sendStatus(401)
      return
    }
    if (user.role !== payload.role) {
      res.sendStatus(401)
      return
    }

    res.status(200).json(payload)
  }

  async update (req: Request, res: Response): Promise<void> {
    const { body } = req
    if (body.username === undefined || body.password === undefined) {
      res.sendStatus(422)
      return
    }

    const data = await this.authRepository.getUserByName(body.username as string) ?? null
    if (data === null || body.newPassword === undefined) {
      res.sendStatus(400)
      return
    }
    const valid = await comparePassword(body.password as string, data.password)
    if (!valid) {
      res.sendStatus(401)
      return
    }

    const newHashedPassword = await hashPassword(body.newPassword as string)
    const user: User = { username: data.username, password: newHashedPassword, role: data.role }
    const status = await this.authRepository.updateUser(user)
    if (status !== 0) {
      res.sendStatus(500)
      return
    }

    res.sendStatus(200)
  }

  async delete (req: Request, res: Response): Promise<void> {
    const { body } = req
    if (body.username === undefined || body.password === undefined) {
      res.sendStatus(422)
      return
    }
    const user = await this.authRepository.getUserByName(body.username as string) ?? null
    if (user === null) {
      res.sendStatus(400)
      return
    }
    const valid = await comparePassword(body.password as string, user.password)
    if (!valid) {
      res.sendStatus(401)
      return
    }

    const status = await this.authRepository.deleteUser(body.username as string)
    if (status !== 0) {
      res.sendStatus(400)
      return
    }

    res.sendStatus(200)
  }
}
