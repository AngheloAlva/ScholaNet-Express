/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Router } from 'express'
import { ProgramService } from '../services/program.service'
import { ProgramController } from './controller'
import { body, param } from 'express-validator'
import { validate } from '../../middlewares/validation.middleware'

export class ProgramRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new ProgramService()
    const controller = new ProgramController(service)

    router.get('/programs', controller.getPrograms)
    router.get('/program/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id is required'),
      validate
    ], controller.getProgramById)

    router.post('/program', [
      body('name').isString().notEmpty().withMessage('Name is required'),
      body('description').isString().notEmpty().withMessage('Description is required'),
      validate
    ], controller.createProgram)

    return router
  }
}
