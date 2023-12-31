/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { CourseService } from '../services/courses.service'
import { CourseController } from './controller'
import { body, param } from 'express-validator'
import { validate } from '../../middlewares/validation.middleware'
import { idValidation } from '../validations/idValidation'

export class CourseRoutes {
  static get routes (): Router {
    const router = Router()
    const courseService = new CourseService()
    const controller = new CourseController(courseService)

    router.get('/courses', controller.getCourses)
    router.get('/course/:id', idValidation, controller.getCourseById)

    router.post('/course', [
      body('title').isString().notEmpty().withMessage('Title is required'),
      body('description').isString().notEmpty().withMessage('Description is required'),
      body('program').isMongoId().notEmpty().withMessage('Program is required'),
      body('image').isString().notEmpty().withMessage('Image is required'),
      body('href').isString().notEmpty().withMessage('Href is required'),
      validate
    ], controller.createCourse)

    router.put('/course/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id is required'),
      body('title').isString().optional(),
      body('description').isString().optional(),
      body('program').isMongoId().optional(),
      body('teacher').isMongoId().optional(),
      body('image').isString().optional(),
      body('href').isString().optional(),
      validate
    ], controller.updateCourse)

    router.delete('/course/:id', idValidation, controller.deleteCourse)

    return router
  }
}
