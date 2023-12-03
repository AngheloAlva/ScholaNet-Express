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

    router.post('/inscription', [
      body('name').isString().notEmpty().withMessage('Name is required'),
      body('lastName').isString().notEmpty().withMessage('Last name is required'),
      body('dateOfBirth').isString().notEmpty().withMessage('Date of birth is required'),
      body('rut').isString().notEmpty().withMessage('Rut is required'),
      body('guardian').isMongoId().notEmpty().withMessage('Guardian is required'),
      body('password').isString().notEmpty().withMessage('Password is required'),
      body('program').isMongoId().notEmpty().withMessage('Program is required'),
      validate
    ], controller.createInscription)

    return router
  }
}
