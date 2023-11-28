import { Router } from 'express'
import { InscriptionRoutes } from './inscriptions/routes'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppRoutes {
  static get routes (): Router {
    const router = Router()

    router.use('/api', InscriptionRoutes.routes)

    return router
  }
}
