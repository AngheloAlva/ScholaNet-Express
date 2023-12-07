/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { CustomError } from '../../domain/errors/custom.error'

import { type CourseService } from '../services/courses.service'
import { type Request, type Response } from 'express'
import type { ObjectId } from 'mongoose'

export class CourseController {
  constructor (
    private readonly courseService: CourseService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, program, teacher, image, href } = req.body
      const newCourse = await this.courseService.createCourse({
        title,
        description,
        program,
        teacher,
        image,
        href
      })
      res.status(201).json(newCourse)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const courses = await this.courseService.getCourses({
        page: Number(page),
        limit: Number(limit)
      })
      res.status(200).json(courses)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const course = await this.courseService.getCourseById(id as unknown as ObjectId)
      res.status(200).json(course)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const data = req.body
      const course = await this.courseService.updateCourse({ id, ...data })

      res.status(200).json(course)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      await this.courseService.deleteCourse(id as unknown as ObjectId)
      res.status(200).json({
        message: 'Course deleted successfully'
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getAssignmentsByCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId } = req.params
      const assignments = await this.courseService.getAssignmentsByCourse(courseId as unknown as ObjectId)
      res.status(200).json(assignments)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getMaterialsByCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId } = req.params
      const materials = await this.courseService.getMaterialsByCourse(courseId as unknown as ObjectId)
      res.status(200).json(materials)
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
