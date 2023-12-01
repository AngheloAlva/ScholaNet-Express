/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { CustomError } from '../../domain/errors/custom.error'
import { type UserService } from '../services/user.service'
import { type Request, type Response } from 'express'

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
      const { name, lastName, rut, email, role } = req.body
      const newUser = await this.userService.createUser({
        name,
        lastName,
        rut,
        email,
        role
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
      const user = await this.userService.getUserById(id)
      res.status(200).json(user)
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
