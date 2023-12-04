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
    router.get('/user/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id is required'),
      validate
    ], controller.getUserById)

    router.post('/user', [
      body('name').isString().notEmpty().withMessage('Name is required'),
      body('lastName').isString().notEmpty().withMessage('Last name is required'),
      body('rut').isString().notEmpty().withMessage('Rut is required'),
      body('email').isEmail().withMessage('Email is required'),
      body('role').isString().notEmpty().isIn(['guardian', 'teacher', 'admin']).withMessage('Role is required, must be one of [user, teacher, admin]'),
      validate
    ], controller.createUser)

    router.put('/user/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id is required'),
      body('name').isString().optional(),
      body('lastName').isString().optional(),
      body('email').isEmail().optional(),
      validate
    ], controller.updateUser)

    router.delete('/user/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id is required'),
      validate
    ], controller.deleteUser)

    return router
  }
}
