/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { CustomError } from '../../domain/errors/custom.error'

import type { StudentService } from '../services/student.service'
import type { Request, Response } from 'express'
import type { ObjectId } from 'mongoose'

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

  getStudents = async (req: Request, res: Response): Promise<void> => {
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

  getStudentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const student = await this.studentService.getStudentById(id)
      res.status(200).json(student)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  updateStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { password, program, guardian } = req.body

      const student = await this.studentService.updateStudent({
        id: id as unknown as ObjectId,
        password,
        program,
        guardian
      })

      res.status(200).json(student)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  deleteStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      await this.studentService.deleteStudent(id as unknown as ObjectId)

      res.status(200).json({ message: 'Student deleted successfully' })
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
