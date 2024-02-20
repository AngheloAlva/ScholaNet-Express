import { CustomError } from '../../domain/errors/custom.error'

import type { CourseInstanceService } from '../services/courseInstance.service'
import type { Request, Response } from 'express'
import type { ObjectId } from 'mongoose'

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
      const { academicYear, classroom, course, semester, teacher } = req.body
      const newCourseInstance = await this.courseInstanceService.createCourseInstance({
        academicYear,
        classroom,
        course,
        semester,
        teacher
      })
      res.status(201).json(newCourseInstance)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getCourseInstances = async (req: any, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const { total, courseInstances } = await this.courseInstanceService.getCourseInstances({
        page: Number(page),
        limit: Number(limit)
      })
      res.status(200).json({
        total,
        courseInstances
      })
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

  getEvaluationsByCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const evaluations = await this.courseInstanceService.getEvaluationsByCourseInstance(id as unknown as ObjectId)

      res.status(200).json(evaluations)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getMaterialsByCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const materials = await this.courseInstanceService.getMaterialsByCourseInstance(id as unknown as ObjectId)

      res.status(200).json(materials)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getAverageGradeByStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { studentId, courseInstanceId } = req.params
      const averageGrade = await this.courseInstanceService.getAverageGradeByStudent(
        courseInstanceId as unknown as ObjectId,
        studentId as unknown as ObjectId
      )

      res.status(200).json(averageGrade)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getCourseInstancesByTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      const actualYear = new Date().getFullYear()

      const { teacherId } = req.params
      const { academicYear } = req.query

      const { schedules, courseInstances } = await this.courseInstanceService.getCourseInstancesByTeacher(
        teacherId as unknown as ObjectId,
        academicYear?.toString() ?? actualYear.toString()
      )

      res.status(200).json({
        schedules,
        courseInstances
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
