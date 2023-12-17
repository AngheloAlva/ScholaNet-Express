/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { CustomError } from '../../domain/errors/custom.error'

import type { AuthService } from '../services/auth.service'
import type { Response, Request } from 'express'

export class AuthController {
  constructor (
    private readonly authService: AuthService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body
      const { token, refreshToken } = await this.authService.loginUser({ email, password })

      res.status(200).json({ token, refreshToken })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body
      if (refreshToken == null) {
        res.status(400).json({
          message: 'Refresh token is required'
        })
      }

      const newAccessToken = await this.authService.refreshToken(refreshToken)
      res.status(200).json({
        token: newAccessToken
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  verifyUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, code } = req.body
      const { token, refreshToken } = await this.authService.verifyUser(email, code)

      res.status(200).json({ token, refreshToken })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body
      await this.authService.handlePasswordResetRequest(email)

      res.status(200).json({
        message: 'Password reset request sent successfully. Check your email'
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, password } = req.body
      await this.authService.resetPassword(token, password)

      res.status(200).json({
        message: 'Password reset successfully'
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body
      const isValid = await this.authService.verifyToken(token)

      res.status(200).json({
        isValid
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
