/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { body, param } from 'express-validator'

import { EvaluationService } from '../services/evaluation.service'
import { validate } from '../../middlewares/validation.middleware'
import { idValidation } from '../validations/idValidation'
import { EvaluationController } from './controller'

export class EvaluationRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new EvaluationService()
    const controller = new EvaluationController(service)

    router.get('/evaluations', controller.getEvaluations)
    router.get('/evaluation/:id', idValidation, controller.getEvaluationById)

    router.post('/evaluation', [
      body('title').isString().notEmpty().withMessage('Title is required'),
      body('type').isString().isIn(['paper', 'online', 'presentation', 'project']).withMessage('Type is required, and must be one of: paper, online, presentation, project'),
      body('description').isString().notEmpty().withMessage('Description is required'),
      body('dueDate').isString().notEmpty().withMessage('Due date is required'),
      body('course').isMongoId().notEmpty().withMessage('Course is required'),
      body('questions').isArray().notEmpty().withMessage('Questions is required'),
      validate
    ], controller.createEvaluation)

    router.put('/evaluation/:id', [
      param('id').isMongoId().optional().withMessage('Id is required'),
      body('title').isString().optional().withMessage('Title is required'),
      body('description').isString().optional().withMessage('Description is required'),
      body('dueDate').isString().optional().withMessage('Due date is required'),
      validate
    ], controller.updateEvaluation)

    router.delete('/evaluation/:id', idValidation, controller.deleteEvaluation)

    return router
  }
}
