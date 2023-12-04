/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Router } from 'express'
import { StudentService } from '../services/student.service'
import { StudentController } from './controller'
import { idValidation } from '../validations/idValidation'

export class StudentRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new StudentService()
    const controller = new StudentController(service)

    router.get('/students', controller.getStudents)
    router.get('/student/:id', idValidation, controller.getStudentById)

    return router
  }
}
