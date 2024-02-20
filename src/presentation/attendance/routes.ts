/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { AttendanceService } from '../services/attendance.service'
import { AttendanceController } from './controller'
import { body, param } from 'express-validator'

export class AttendanceRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new AttendanceService()
    const controller = new AttendanceController(service)

    router.get('/attendance/course/:courseId', [
      param('courseId').isMongoId().notEmpty().withMessage('Course ID is required')
    ], controller.getAttendancesByCourse)
    router.get('/attendance/person/:personId', [
      param('personId').isMongoId().notEmpty().withMessage('Person ID is required')
    ], controller.getAttendanceByPerson)

    router.post('/attendance', [
      body('date').isDate().notEmpty().withMessage('Date is required'),
      body('courseInstance').isMongoId().notEmpty().withMessage('Course ID is required'),
      body('person').isMongoId().notEmpty().withMessage('Person is required'),
      body('status').isString().isIn(['present', 'absent', 'late', 'excused']).notEmpty().withMessage('Status is required')
    ], controller.createAttendance)

    return router
  }
}
