/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Router } from 'express'

import { BehaviorReportRoutes } from './behaviorReport/routes'
import { CourseInstanceRoutes } from './courseInstance/routes'
import { InscriptionRoutes } from './inscriptions/routes'
import { EvaluationRoutes } from './evaluation/routes'
import { AttendanceRoutes } from './attendance/routes'
import { MaterialRoutes } from './material/routes'
import { QuestionRoutes } from './question/routes'
import { SemesterRoutes } from './semester/routes'
import { StudentRoutes } from './student/routes'
import { ProgramRoutes } from './program/routes'
import { CourseRoutes } from './course/routes'
import { UserRoutes } from './user/routes'
import { AuthRoutes } from './auth/routes'

export class AppRoutes {
  static get routes (): Router {
    const router = Router()

    router.use('/api', CourseInstanceRoutes.routes)
    router.use('/api', BehaviorReportRoutes.routes)
    router.use('/api', InscriptionRoutes.routes)
    router.use('/api', AttendanceRoutes.routes)
    router.use('/api', EvaluationRoutes.routes)
    router.use('/api', MaterialRoutes.routes)
    router.use('/api', QuestionRoutes.routes)
    router.use('/api', SemesterRoutes.routes)
    router.use('/api', ProgramRoutes.routes)
    router.use('/api', StudentRoutes.routes)
    router.use('/api', CourseRoutes.routes)
    router.use('/api', UserRoutes.routes)
    router.use('/api', AuthRoutes.routes)

    return router
  }
}
