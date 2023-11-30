import { Router } from 'express'
import { InscriptionRoutes } from './inscriptions/routes'
import { CourseRoutes } from './course/routes'
import { EvaluationRoutes } from './assignments/routes'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppRoutes {
  static get routes (): Router {
    const router = Router()

    router.use('/api', InscriptionRoutes.routes)
    router.use('/api', CourseRoutes.routes)
    router.use('/api', EvaluationRoutes.routes)

    return router
  }
}
