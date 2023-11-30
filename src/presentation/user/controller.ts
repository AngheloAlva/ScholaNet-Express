/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { type Response } from 'express'
import { type UserService } from '../services/user.service'
import { CustomError } from '../../domain/errors/custom.error'

export class UserController {
  constructor (
    private readonly userService: UserService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createUser = async (req: any, res: Response): Promise<Response> => {
    try {
      const { name, lastName, rut, email, role, students } = req.body
      const newUser = await this.userService.createUser({
        name,
        lastName,
        rut,
        email,
        role,
        students
      })
      return res.status(201).json(newUser)
    } catch (error) {
      return this.handleError(error, res)
    }
  }

  getUsers = async (req: any, res: Response): Promise<Response> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const users = await this.userService.getUsers({
        page: Number(page),
        limit: Number(limit)
      })
      return res.status(200).json(users)
    } catch (error) {
      return this.handleError(error, res)
    }
  }

  getUserById = async (req: any, res: Response): Promise<Response> => {
    try {
      const { id } = req.params
      const user = await this.userService.getUserById(id)
      return res.status(200).json(user)
    } catch (error) {
      return this.handleError(error, res)
    }
  }
}
