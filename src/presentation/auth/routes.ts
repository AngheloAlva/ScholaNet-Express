/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { body } from 'express-validator'
import { validate } from '../../middlewares/validation.middleware'
import { AuthService } from '../services/auth.service'
import { AuthController } from './controller'
import { Router } from 'express'

export class AuthRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new AuthService()
    const controller = new AuthController(service)

    router.post('/auth/login', [
      body('email').isEmail().withMessage('Email is required'),
      body('password').isString().notEmpty().withMessage('Password is required'),
      validate
    ], controller.loginUser)
    router.post('/auth/verify-email', [
      body('email').isEmail().withMessage('Email is required'),
      body('code').isString().notEmpty().withMessage('Verification code is required'),
      validate
    ], controller.verifyUser)
    router.post('/auth/request-password-reset', [
      body('email').isEmail().withMessage('Email is required'),
      validate
    ], controller.requestPasswordReset)
    router.post('/auth/reset-password', [
      body('token').isString().notEmpty().withMessage('Token is required'),
      body('password').isString().notEmpty().withMessage('Password is required'),
      validate
    ], controller.resetPassword)
    router.post('/auth/refresh-token', [
      body('refreshToken').isString().notEmpty().withMessage('Refresh token is required'),
      validate
    ], controller.refreshToken)
    router.post('/auth/verifytoken', [
      body('token').isString().notEmpty().withMessage('Token is required'),
      validate
    ], controller.verifyToken)

    return router
  }
}
