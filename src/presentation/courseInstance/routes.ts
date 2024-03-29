/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { CourseInstanceService } from '../services/courseInstance.service'
import { CourseInstanceController } from './controller'
import { validate } from '../../middlewares/validation.middleware'
import { body, param, query } from 'express-validator'
import { idValidation } from '../validations/idValidation'

export class CourseInstanceRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new CourseInstanceService()
    const controller = new CourseInstanceController(service)

    router.get('/course-instances', [
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1 }),
      validate
    ], controller.getCourseInstances)
    router.get('/course-instance/:id', idValidation, controller.getCourseInstanceById)
    router.get('/course-instance/evaluations/:id', idValidation, controller.getEvaluationsByCourse)
    router.get('/course-instance/materials/:id', idValidation, controller.getMaterialsByCourse)
    router.get('/course-instance/:courseInstanceId/student/:studentId', [
      param('courseInstanceId').isMongoId().notEmpty().withMessage('Id must be a valid MongoId'),
      param('studentId').isMongoId().notEmpty().withMessage('Id must be a valid MongoId'),
      validate
    ], controller.getAverageGradeByStudent)
    router.get('/course-instance/teacher/:teacherId', [
      param('teacherId').isMongoId().notEmpty().withMessage('Id must be a valid MongoId'),
      query('academicYear').optional().isString(),
      validate
    ], controller.getCourseInstancesByTeacher)

    router.post('/course-instance', [
      body('academicYear').notEmpty().withMessage('Academic year is required'),
      body('classroom').notEmpty().withMessage('Classroom is required'),
      body('course').isMongoId().notEmpty().withMessage('Course is required'),
      body('semester').isMongoId().notEmpty().withMessage('Semester is required'),
      body('teacher').isMongoId().notEmpty().withMessage('Teacher is required'),
      validate
    ], controller.createCourseInstance)
    router.post('/course-instance/add-student/:courseInstanceId', [
      param('courseInstanceId').isMongoId().notEmpty().withMessage('Id must be a valid MongoId'),
      body('studentId').isMongoId().notEmpty().withMessage('Student id is required'),
      validate
    ], controller.addStudentToCourseInstance)

    router.put('/course-instance/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id must be a valid MongoId'),
      body('classroom').optional().notEmpty(),
      body('schedule').optional().isArray(),
      body('schedule.*.day').optional().isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
      body('schedule.*.startTime').optional().isString(),
      body('schedule.*.duration').optional().isInt({ min: 1 }),
      body('schedule.*.endTime').optional().isString(),
      body('teacher').optional().isMongoId(),
      validate
    ], controller.updateCourseInstance)

    return router
  }
}
