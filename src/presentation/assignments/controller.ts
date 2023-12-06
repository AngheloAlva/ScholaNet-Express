/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { type Request, type Response } from 'express'
import { type AssignmentService } from '../services/assignments.service'
import { CustomError } from '../../domain/errors/custom.error'
import mongoose from 'mongoose'

export class AssignmentController {
  constructor (
    private readonly assignmentsService: AssignmentService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createAssignments = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, dueDate, course, type, score } = req.body
      const newAssignment = await this.assignmentsService.createAssignment({
        title,
        description,
        dueDate,
        course,
        type,
        score
      })
      res.status(201).json(newAssignment)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getAssignments = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const assignments = await this.assignmentsService.getAssignments({
        page: Number(page),
        limit: Number(limit)
      })
      res.status(200).json(assignments)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getAssignmentsById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = new mongoose.Schema.Types.ObjectId(req.params.id)
      const assignment = await this.assignmentsService.getAssignmentsById(id)
      res.status(200).json(assignment)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  updateAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const data = req.body

      const assignment = await this.assignmentsService.updateAssignment({ id, ...data })

      res.status(200).json(assignment)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  deleteAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = new mongoose.Schema.Types.ObjectId(req.params.id)
      await this.assignmentsService.deleteAssignment(id)
      res.status(204).json({
        message: 'Assignment deleted'
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
