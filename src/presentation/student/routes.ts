/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Router } from 'express'
import { StudentService } from '../services/student.service'
import { StudentController } from './controller'
import { body, param } from 'express-validator'
import { validate } from '../../middlewares/validation.middleware'

export class StudentRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new StudentService()
    const controller = new StudentController(service)

    router.get('/students', controller.getStudents)
    router.get('/students/:id', [
      param('id').isString(),
      validate
    ], controller.getStudentById)

    router.post('/student', [
      body('name').isString(),
      body('lastName').isString(),
      body('dateOfBirth').isDate(),
      body('rut').isString(),
      body('password').isString(),
      body('program').isString(),
      validate
    ], controller.createStudent)

    return router
  }
}
