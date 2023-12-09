import jwt from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'
import { envs } from '../config/envs'

declare module 'express' {
  interface Request {
    user?: any
  }
}

export function authMiddleware (req: Request, res: Response, next: NextFunction): void | Response<void> {
  const token = req.headers.authorization?.split(' ')[1]
  if (token == null) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const verified = jwt.verify(token, envs.TOKEN_SECRET)
    req.user = verified
    next()
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' })
  }
}
