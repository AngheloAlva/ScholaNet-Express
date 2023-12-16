/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { BehaviorReportService } from '../services/behaviorReport.service'
import { BehaviorReportController } from './controller'
import { body, param } from 'express-validator'
import { idValidation } from '../validations/idValidation'
import { validate } from '../../middlewares/validation.middleware'

export class BehaviorReportRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new BehaviorReportService()
    const controller = new BehaviorReportController(service)

    router.get('/behaviorReports', controller.getBehaviorReports)
    router.get('/behaviorReport/:id', idValidation, controller.getBehaviorReportById)

    router.post('/behaviorReport', [
      body('student').isMongoId().notEmpty().withMessage('Student is required'),
      body('description').isString().notEmpty().withMessage('Description is required'),
      body('severity').isString().isIn(['mild', 'moderate', 'severe']).notEmpty().withMessage('Severity is required'),
      body('resolved').isBoolean().notEmpty().withMessage('Resolved is required'),
      validate
    ], controller.createBehaviorReport)

    router.put('/behaviorReport/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id is required'),
      body('description').isString().optional(),
      body('severity').isString().isIn(['mild', 'moderate', 'severe']).optional(),
      body('resolved').isBoolean().optional(),
      validate
    ], controller.updateBehaviorReport)

    return router
  }
}
