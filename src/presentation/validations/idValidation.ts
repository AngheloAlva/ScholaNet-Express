import { param } from 'express-validator'
import { validate } from '../../middlewares/validation.middleware'

export const idValidation = [
  param('id').isMongoId().notEmpty().withMessage('Id is required'),
  validate
]
