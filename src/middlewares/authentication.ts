import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      authenticated: boolean
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret'

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]
  req.authenticated = false

  if (token !== undefined) {
    try {
      jwt.verify(token, JWT_SECRET)
      req.authenticated = true
    } catch (err) {}
  }
  next()
}
