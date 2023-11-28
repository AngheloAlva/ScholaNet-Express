import { Router } from 'express'
import { InscriptionController } from './controller'
import { InscriptionService } from '../services/inscriptions.service'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class InscriptionRoutes {
  static get routes (): Router {
    const router = Router()
    const inscriptionService = new InscriptionService()
    const controller = new InscriptionController(inscriptionService)

    router.get('/inscriptions', controller.getInscriptions)
    router.post('/inscriptions', controller.createInscription)

    return router
  }
}
