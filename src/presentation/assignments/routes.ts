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

    router.get('/assignment', controller.getAssignments)
    router.get('/assignment/:id', [
      param('id').isString(),
      validate
    ], controller.getAssignmentsById)

    router.post('/assignment', [
      body('title').isString(),
      body('type').isIn(['task', 'evaluation']),
      body('description').isString(),
      body('dueDate').isString(),
      body('course').isString(),
      validate
    ], controller.createAssignments)

    return router
  }
}
