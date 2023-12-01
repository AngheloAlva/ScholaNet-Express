/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { AssignmentService } from '../services/assignments.service'
import { AssignmentController } from './controller'
import { body, param } from 'express-validator'
import { validate } from '../../middlewares/validation.middleware'

export class AssignmentRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new AssignmentService()
    const controller = new AssignmentController(service)

    router.get('/assignments', controller.getAssignments)
    router.get('/assignment/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id is required'),
      validate
    ], controller.getAssignmentsById)

    router.post('/assignment', [
      body('title').isString().notEmpty().withMessage('Title is required'),
      body('type').isIn(['task', 'evaluation']).notEmpty().withMessage('Type is required, must be one of [task, evaluation]'),
      body('description').isString().notEmpty().withMessage('Description is required'),
      body('dueDate').isString().notEmpty().withMessage('Due date is required'),
      body('course').isMongoId().notEmpty().withMessage('Course is required'),
      validate
    ], controller.createAssignments)

    return router
  }
}
