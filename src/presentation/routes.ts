import { Router } from 'express'
import { InscriptionRoutes } from './inscriptions/routes'
import { CourseRoutes } from './course/routes'
import { EvaluationRoutes } from './evaluation/routes'
import { MaterialRoutes } from './material/routes'
import { ProgramRoutes } from './program/routes'
import { StudentRoutes } from './student/routes'
import { UserRoutes } from './user/routes'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppRoutes {
  static get routes (): Router {
    const router = Router()

    router.use('/api', UserRoutes.routes)
    router.use('/api', ProgramRoutes.routes)
    router.use('/api', CourseRoutes.routes)
    router.use('/api', EvaluationRoutes.routes)
    router.use('/api', MaterialRoutes.routes)
    router.use('/api', StudentRoutes.routes)
    router.use('/api', InscriptionRoutes.routes)

    return router
  }
}
