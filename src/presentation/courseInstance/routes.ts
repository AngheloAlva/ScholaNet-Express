/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { CourseInstanceService } from '../services/courseInstance.service'
import { CourseInstanceController } from './controller'
import { validate } from '../../middlewares/validation.middleware'
import { body, param, query } from 'express-validator'

export class CourseInstanceRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new CourseInstanceService()
    const controller = new CourseInstanceController(service)

    router.get('/courses-instances', [
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1 }),
      validate
    ], controller.getCoursesInstances)
    router.get('/courses-instances/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id must be a valid MongoId'),
      validate
    ], controller.getCourseInstanceById)

    router.post('/courses-instances', [
      body('academicYear').notEmpty().withMessage('Academic year is required'),
      body('classroom').notEmpty().withMessage('Classroom is required'),
      body('course').isMongoId().notEmpty().withMessage('Course is required'),
      body('schedule').isArray().notEmpty().withMessage('Schedule is required'),
      body('semester').isMongoId().notEmpty().withMessage('Semester is required'),
      body('teacher').isMongoId().notEmpty().withMessage('Teacher is required')
    ], validate, controller.createCourseInstance)
    router.post('/courses-instances/:courseInstanceId', [
      param('courseInstanceId').isMongoId().notEmpty().withMessage('Id must be a valid MongoId'),
      body('studentId').isMongoId().notEmpty().withMessage('Student id is required'),
      validate
    ], validate, controller.addStudentToCourseInstance)

    router.put('/courses-instances/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id must be a valid MongoId'),
      body('classroom').optional().notEmpty().withMessage('Classroom is required'),
      body('schedule').optional().isArray().withMessage('Schedule must be an array'),
      body('teacher').optional().isMongoId().withMessage('Teacher must be a valid MongoId'),
      validate
    ], controller.updateCourseInstance)

    return router
  }
}