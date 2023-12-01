/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { CustomError } from '../../domain/errors/custom.error'
import { type StudentService } from '../services/student.service'
import { type Response } from 'express'

export class StudentController {
  constructor (
    private readonly studentService: StudentService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  getStudents = async (req: any, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const students = await this.studentService.getStudents({
        page: Number(page),
        limit: Number(limit)
      })
      res.status(200).json(students)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getStudentById = async (req: any, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const student = await this.studentService.getStudentById(id)
      res.status(200).json(student)
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
