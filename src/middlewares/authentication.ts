import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import type { Payload } from '@/lib/cryptography'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      role: string
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret'

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ').pop()
  console.info(req.url, token)
  req.role = 'guest'
  if (token != null) {
    console.log({ JWT_SECRET })
    console.log(jwt.verify(token, JWT_SECRET))
    try {
      const { role } = jwt.verify(token, JWT_SECRET) as Payload
      req.role = role
    } catch (err) {}
  }
  console.log('Role: ', req.role)
  next()
}
