/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { validate } from '../../middlewares/validation.middleware'
import { ScheduleService } from '../services/schedule.service'
import { idValidation } from '../validations/idValidation'
import { ScheduleController } from './controller'
import { body, param } from 'express-validator'
import { Router } from 'express'

export class ScheduleRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new ScheduleService()
    const controller = new ScheduleController(service)

    router.get('/schedules', controller.getSchedules)
    router.get('/schedule/:id', idValidation, controller.getScheduleById)

    router.post('/schedule', [
      body('assignedStudents').isArray().notEmpty().withMessage('Assigned students are required'),
      body('courseInstances').isArray().notEmpty().withMessage('Course instances are required'),
      body('name').isString().notEmpty().withMessage('Name is required'),
      validate
    ], controller.createSchedule)

    router.put('/schedule/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id must be a valid MongoId'),
      body('assignedStudents').optional().isArray().withMessage('Assigned students must be an array'),
      body('courseInstances').optional().isArray().withMessage('Course instances must be an array'),
      body('name').optional().isString().withMessage('Name must be a string'),
      validate
    ], controller.updateSchedule)

    router.delete('/schedule/:id', idValidation, controller.deleteSchedule)

    return router
  }
}
