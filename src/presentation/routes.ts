/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Router } from 'express'
import {
  BehaviorReportRoutes,
  CourseInstanceRoutes,
  InscriptionRoutes,
  EvaluationRoutes,
  AttendanceRoutes,
  QuestionRoutes,
  ScheduleRoutes,
  SemesterRoutes,
  MaterialRoutes,
  ProgramRoutes,
  StudentRoutes,
  CourseRoutes,
  UserRoutes,
  AuthRoutes
} from './routes.exports'

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
    router.use('/api', ScheduleRoutes.routes)
    router.use('/api', ProgramRoutes.routes)
    router.use('/api', StudentRoutes.routes)
    router.use('/api', CourseRoutes.routes)
    router.use('/api', UserRoutes.routes)
    router.use('/api', AuthRoutes.routes)

    return router
  }
}
