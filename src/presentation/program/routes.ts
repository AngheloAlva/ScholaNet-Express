/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Router } from 'express'
import { ProgramService } from '../services/program.service'
import { ProgramController } from './controller'
import { param } from 'express-validator'

export class ProgramRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new ProgramService()
    const controller = new ProgramController(service)

    router.get('/programs', controller.getPrograms)
    router.get('/programs/:id', [
      param('id').isString()
    ], controller.getProgramById)

    router.post('/programs', [
      param('name').isString(),
      param('description').isString(),
      param('courses').isArray()
    ], controller.createProgram)

    return router
  }
}
