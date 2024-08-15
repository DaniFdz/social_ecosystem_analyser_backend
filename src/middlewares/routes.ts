import { type Request, type Response, type NextFunction } from 'express'

export const noGuests = (req: Request, res: Response, next: NextFunction): void => {
  if (req.role === 'guest') {
    res.sendStatus(401)
    return
  }
  next()
}
