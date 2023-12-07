/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Router } from 'express'
import { ProgramService } from '../services/program.service'
import { ProgramController } from './controller'
import { body, param } from 'express-validator'
import { validate } from '../../middlewares/validation.middleware'
import { idValidation } from '../validations/idValidation'

export class ProgramRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new ProgramService()
    const controller = new ProgramController(service)

    router.get('/programs', controller.getPrograms)
    router.get('/program/:id', idValidation, controller.getProgramById)

    router.post('/program', [
      body('name').isString().notEmpty().withMessage('Name is required'),
      body('description').isString().notEmpty().withMessage('Description is required'),
      validate
    ], controller.createProgram)

    router.put('/program/:id', [
      param('id').isMongoId().withMessage('Invalid id'),
      body('name').isString().optional(),
      body('description').isString().optional(),
      body('courses').isArray().optional(),
      validate
    ], controller.updateProgram)

    return router
  }
}
