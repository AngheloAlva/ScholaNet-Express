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
    router.get('/student/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id is required'),
      validate
    ], controller.getStudentById)

    router.post('/student', [
      body('name').isString().notEmpty().withMessage('Name is required'),
      body('lastName').isString().notEmpty().withMessage('Last name is required'),
      body('dateOfBirth').isDate().notEmpty().withMessage('Date of birth is required'),
      body('rut').isString().notEmpty().withMessage('Rut is required'),
      body('password').isString().notEmpty().withMessage('Password is required'),
      body('program').isMongoId().notEmpty().withMessage('Program is required'),
      validate
    ], controller.createStudent)

    return router
  }
}
