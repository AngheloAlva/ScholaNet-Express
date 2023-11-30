/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { type Request, type Response } from 'express'
import { type AssignmentService } from '../services/assignments.service'
import { CustomError } from '../../domain/errors/custom.error'

export class AssignmentController {
  constructor (
    private readonly assignmentsService: AssignmentService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createAssignments = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { title, description, dueDate, course, type } = req.body
      const newAssignment = await this.assignmentsService.createAssignment({
        title,
        description,
        dueDate,
        course,
        type
      })
      return res.status(201).json(newAssignment)
    } catch (error) {
      return this.handleError(error, res)
    }
  }

  getAssignments = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const assignments = await this.assignmentsService.getAssignments({
        page: Number(page),
        limit: Number(limit)
      })
      return res.status(200).json(assignments)
    } catch (error) {
      return this.handleError(error, res)
    }
  }

  getAssignmentsById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params
      const assignment = await this.assignmentsService.getAssignmentsById(id)
      return res.status(200).json(assignment)
    } catch (error) {
      return this.handleError(error, res)
    }
  }
}
