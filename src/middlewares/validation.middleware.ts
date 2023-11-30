import { validationResult } from 'express-validator'
import type { NextFunction, Request, Response } from 'express'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function validate (req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  next()
}
