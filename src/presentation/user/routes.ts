/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Router } from 'express'
import { UserService } from '../services/user.service'
import { UserController } from './controller'
import { body, param } from 'express-validator'
import { validate } from '../../middlewares/validation.middleware'

export class UserRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new UserService()
    const controller = new UserController(service)

    router.get('/users', controller.getUsers)
    router.get('/users/:id', [
      param('id').isString(),
      validate
    ], controller.getUserById)

    router.post('/user', [
      body('name').isString(),
      body('lastName').isString(),
      body('rut').isString(),
      body('email').isEmail(),
      body('role').isString(),
      body('students').isArray(),
      validate
    ], controller.createUser)

    return router
  }
}
