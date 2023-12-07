/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { validate } from '../../middlewares/validation.middleware'
import { StudentService } from '../services/student.service'
import { idValidation } from '../validations/idValidation'
import { StudentController } from './controller'
import { body, param } from 'express-validator'
import { Router } from 'express'

export class StudentRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new StudentService()
    const controller = new StudentController(service)

    router.get('/students', controller.getStudents)
    router.get('/student/:id', idValidation, controller.getStudentById)

    router.put('/student/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id must be a valid MongoId'),
      body('password').isString().optional(),
      body('program').isMongoId().optional(),
      body('guardian').isMongoId().optional(),
      validate
    ], controller.updateStudent)

    router.delete('/student/:id', idValidation, controller.deleteStudent)

    return router
  }
}
