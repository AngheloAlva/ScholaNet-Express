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
    router.get('/schedule/wihoutSchedule', controller.getCoursesWithoutSchedule)

    router.post('/schedule', [
      body('name').isString().notEmpty().withMessage('Name is required'),
      body('days').isArray().withMessage('Days must be an array'),
      body('days.*.day').isString().isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']).withMessage('Day must be a valid day'),
      body('days.*.blocks').isArray().withMessage('Blocks must be an array'),
      body('days.*.blocks.*.startTime').isString().notEmpty().withMessage('Start time is required'),
      body('days.*.blocks.*.endTime').isString().notEmpty().withMessage('End time is required'),
      body('days.*.blocks.*.courseInstance').isMongoId().notEmpty().withMessage('Course instance must be a valid MongoId'),
      body('days.*.blocks.*.assignedStudents').isArray().withMessage('Assigned students must be an array'),
      validate
    ], controller.createSchedule)

    router.put('/schedule/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id must be a valid MongoId'),
      body('name').optional().isString().withMessage('Name must be a string'),
      body('days').optional().isArray().withMessage('Days must be an array'),
      body('days.*.day').optional().isString().isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']).withMessage('Day must be a valid day'),
      body('days.*.blocks').optional().isArray().withMessage('Blocks must be an array'),
      body('days.*.blocks.*.startTime').optional().isString().notEmpty().withMessage('Start time is required'),
      body('days.*.blocks.*.endTime').optional().isString().notEmpty().withMessage('End time is required'),
      body('days.*.blocks.*.courseInstance').optional().isMongoId().notEmpty().withMessage('Course instance must be a valid MongoId'),
      body('days.*.blocks.*.assignedStudents').optional().isArray().withMessage('Assigned students must be an array'),
      validate
    ], controller.updateSchedule)

    router.delete('/schedule/:id', idValidation, controller.deleteSchedule)

    return router
  }
}
