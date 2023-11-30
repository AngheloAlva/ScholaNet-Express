/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { CourseService } from '../services/courses.service'
import { CourseController } from './controller'
import { body } from 'express-validator'
import { validate } from '../../middlewares/validation.middleware'

export class CourseRoutes {
  static get routes (): Router {
    const router = Router()
    const courseService = new CourseService()
    const controller = new CourseController(courseService)

    router.get('/courses', controller.getCourses)

    router.post('/courses', [
      body('title').isString(),
      body('description').isString(),
      body('level').isString(),
      body('teacher').isString(),
      validate
    ], controller.createCourse)

    return router
  }
}
