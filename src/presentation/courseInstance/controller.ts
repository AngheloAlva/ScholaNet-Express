import { CustomError } from '../../domain/errors/custom.error'

import type { CourseInstanceService } from '../services/courseInstance.service'
import type { Response } from 'express'

export class CourseInstanceController {
  constructor (
    private readonly courseInstanceService: CourseInstanceService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createCourseInstance = async (req: any, res: Response): Promise<void> => {
    try {
      const { academicYear, classroom, course, schedule, semester, teacher } = req.body
      const newCourseInstance = await this.courseInstanceService.createCourseInstance({
        academicYear,
        classroom,
        course,
        schedule,
        semester,
        teacher
      })
      res.status(201).json(newCourseInstance)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getCoursesInstances = async (req: any, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const coursesInstances = await this.courseInstanceService.getCoursesInstances({
        page: Number(page),
        limit: Number(limit)
      })
      res.status(200).json(coursesInstances)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getCourseInstanceById = async (req: any, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const courseInstance = await this.courseInstanceService.getCourseInstanceById(id)
      res.status(200).json(courseInstance)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  updateCourseInstance = async (req: any, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { teacher, classroom, schedule } = req.body
      const updatedCourseInstance = await this.courseInstanceService.updateCourseInstance({
        id,
        teacher,
        classroom,
        schedule
      })
      res.status(200).json(updatedCourseInstance)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  addStudentToCourseInstance = async (req: any, res: Response): Promise<void> => {
    try {
      const { courseInstanceId } = req.params
      const { studentId } = req.body
      const updatedCourseInstance = await this.courseInstanceService.addStudentToCourseInstance(
        courseInstanceId,
        studentId
      )

      res.status(200).json(updatedCourseInstance)
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
