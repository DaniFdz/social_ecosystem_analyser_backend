import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { Role } from '@v1/auth/models/authInterface'

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret'

export interface Payload {
  id: string
  username: string
  role: Role
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  const valid = await bcrypt.compare(password, hash)
  return valid
}

export const generateToken = (payload: Payload): string => {
  return jwt.sign(payload, JWT_SECRET)
}

export const verifyToken = (token: string): Payload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Payload
    return decoded
  } catch {
    return null
  }
}
