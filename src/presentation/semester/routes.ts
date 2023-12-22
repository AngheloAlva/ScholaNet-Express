/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { SemesterService } from '../services/semester.service'
import { SemesterController } from './controller'
import { body, param } from 'express-validator'
import { validate } from '../../middlewares/validation.middleware'
import { idValidation } from '../validations/idValidation'

export class SemesterRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new SemesterService()
    const controller = new SemesterController(service)

    router.get('/semesters', controller.getSemesters)
    router.get('/semester/:id', idValidation, controller.getSemesterById)

    router.post('/semester', [
      body('name').isString().notEmpty().withMessage('Name is required'),
      body('startDate').isString().notEmpty().withMessage('Start date is required'),
      body('endDate').isString().notEmpty().withMessage('End date is required'),
      validate
    ], controller.createSemester)

    router.put('/semester/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id must be a valid MongoId'),
      body('name').optional().isString().withMessage('Name must be a string'),
      body('startDate').optional().isDate().withMessage('Start date must be a date'),
      body('endDate').optional().isDate().withMessage('End date must be a date'),
      validate
    ], controller.updateSemester)

    return router
  }
}
