/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Router } from 'express'
import { UserService } from '../services/user.service'
import { UserController } from './controller'
import { body, param } from 'express-validator'
import { validate } from '../../middlewares/validation.middleware'
import { idValidation } from '../validations/idValidation'

export class UserRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new UserService()
    const controller = new UserController(service)

    router.get('/users', controller.getUsers)
    router.get('/user/:id', idValidation, controller.getUserById)
    router.get('/user/rut/:rut', [
      param('rut').isString().notEmpty().withMessage('Rut is required'),
      validate
    ], controller.getUserByRut)
    router.get('/user/courses-instances/teacher/:teacherId', [
      param('teacherId').isMongoId().notEmpty().withMessage('Id is required'),
      validate
    ], controller.getCoursesInstancesByTeacher)

    router.post('/user', [
      body('name').isString().notEmpty().withMessage('Name is required'),
      body('lastName').isString().notEmpty().withMessage('Last name is required'),
      body('rut').isString().notEmpty().withMessage('Rut is required'),
      body('email').isEmail().withMessage('Email is required'),
      body('password').isString().notEmpty().withMessage('Password is required'),
      validate
    ], controller.createUser)
    router.post('/user/login', [
      body('email').isEmail().withMessage('Email is required'),
      body('password').isString().notEmpty().withMessage('Password is required'),
      validate
    ], controller.loginUser)
    router.post('/user/verify-email', [
      body('email').isEmail().withMessage('Email is required'),
      body('code').isString().notEmpty().withMessage('Verification code is required'),
      validate
    ], controller.verifyUser)
    router.post('/user/request-password-reset', [
      body('email').isEmail().withMessage('Email is required'),
      validate
    ], controller.requestPasswordReset)
    router.post('/user/reset-password', [
      body('token').isString().notEmpty().withMessage('Token is required'),
      body('password').isString().notEmpty().withMessage('Password is required'),
      validate
    ], controller.resetPassword)
    router.post('/user/refresh-token', [
      body('refreshToken').isString().notEmpty().withMessage('Refresh token is required'),
      validate
    ], controller.refreshToken)
    router.post('/user/verifytoken', [
      body('token').isString().notEmpty().withMessage('Token is required'),
      validate
    ], controller.verifyToken)

    router.put('/user/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id is required'),
      body('name').isString().optional(),
      body('lastName').isString().optional(),
      body('email').isEmail().optional(),
      validate
    ], controller.updateUser)

    router.delete('/user/:id', idValidation, controller.deleteUser)

    return router
  }
}
