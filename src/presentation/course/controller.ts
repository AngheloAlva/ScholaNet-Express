/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { type Response } from 'express'
import { type CourseService } from '../services/courses.service'
import { CustomError } from '../../domain/errors/custom.error'

export class CourseController {
  constructor (
    private readonly courseService: CourseService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createCourse = async (req: any, res: Response): Promise<Response> => {
    try {
      const { title, description, level, teacher } = req.body
      const newCourse = await this.courseService.createCourse({
        title,
        description,
        level,
        teacher
      })
      return res.status(201).json(newCourse)
    } catch (error) {
      return this.handleError(error, res)
    }
  }

  getCourses = async (req: any, res: Response): Promise<Response> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const courses = await this.courseService.getCourses({
        page: Number(page),
        limit: Number(limit)
      })
      return res.status(200).json(courses)
    } catch (error) {
      return this.handleError(error, res)
    }
  }
}
