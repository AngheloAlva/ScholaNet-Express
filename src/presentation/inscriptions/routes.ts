/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { body } from 'express-validator'
import { InscriptionController } from './controller'
import { validate } from '../../middlewares/validation.middleware'
import { InscriptionService } from '../services/inscriptions.service'

export class InscriptionRoutes {
  static get routes (): Router {
    const router = Router()
    const inscriptionService = new InscriptionService()
    const controller = new InscriptionController(inscriptionService)

    router.get('/inscriptions', controller.getInscriptions)

    router.post('/inscriptions', [
      body('studentId').isMongoId(),
      body('programId').isMongoId(),
      body('status').isString(),
      body('enrollmentDate').isDate(),
      validate
    ], controller.createInscription)

    return router
  }
}
