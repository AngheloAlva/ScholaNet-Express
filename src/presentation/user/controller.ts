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
      const { total, users } = await this.userService.getUsers({
        page: Number(page),
        limit: Number(limit)
      })
      res.status(200).json({
        total,
        users
      })
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

  getCoursesInstancesByTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teacherId } = req.params
      const coursesInstances = await this.userService.getCoursesInstancesByTeacher(teacherId as unknown as ObjectId)
      res.status(200).json(coursesInstances)
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
