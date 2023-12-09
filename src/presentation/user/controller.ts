/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { CustomError } from '../../domain/errors/custom.error'

import type { UserService } from '../services/user.service'
import type { Request, Response } from 'express'
import type { ObjectId } from 'mongoose'

export class UserController {
  constructor (
    private readonly userService: UserService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, lastName, rut, email, password } = req.body
      const newUser = await this.userService.createUser({
        name,
        lastName,
        rut,
        email,
        password
      })
      res.status(201).json(newUser)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const users = await this.userService.getUsers({
        page: Number(page),
        limit: Number(limit)
      })
      res.status(200).json(users)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const user = await this.userService.getUserById(id as unknown as ObjectId)
      res.status(200).json(user)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getUserByRut = async (req: Request, res: Response): Promise<void> => {
    try {
      const { rut } = req.params
      const user = await this.userService.getUserByRut(rut)
      res.status(200).json(user)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { name, lastName, email } = req.body

      const user = await this.userService.updateUser({
        id: id as unknown as ObjectId,
        name,
        lastName,
        email
      })

      res.status(200).json(user)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      await this.userService.deleteUser(id as unknown as ObjectId)
      res.status(200).json({
        message: 'User deleted successfully'
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body
      const { token, refreshToken } = await this.userService.loginUser({ email, password })

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

      const newAccessToken = await this.userService.refreshToken(refreshToken)
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
      await this.userService.verifyUser(email, code)
      res.status(200).json({
        message: 'User verified successfully'
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body
      await this.userService.handlePasswordResetRequest(email)

      res.status(200).json({
        message: 'Password reset request sent successfully'
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, password } = req.body
      await this.userService.resetPassword(token, password)

      res.status(200).json({
        message: 'Password reset successfully'
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
