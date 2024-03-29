/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { CustomError } from '../../domain/errors/custom.error'

import type { EvaluationService, Submission } from '../services/evaluation.service'
import type { Request, Response } from 'express'
import type { ObjectId } from 'mongoose'

export class EvaluationController {
  constructor (
    private readonly evaluationService: EvaluationService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createEvaluation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, dueDate, courseInstance, type, duration } = req.body
      const newEvaluation = await this.evaluationService.createEvaluation({
        courseInstance,
        description,
        duration,
        dueDate,
        title,
        type
      })
      res.status(201).json(newEvaluation)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getEvaluations = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const { total, evaluations } = await this.evaluationService.getEvaluations({
        page: Number(page),
        limit: Number(limit)
      })
      res.status(200).json({
        total,
        evaluations
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  gradeSubmission = async (req: Request, res: Response): Promise<void> => {
    try {
      const { submissionId } = req.params
      const { answers } = req.body

      const evaluation = await this.evaluationService.gradeSubmission(submissionId as unknown as ObjectId, answers)

      res.status(200).json(evaluation)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getEvaluationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const evaluation = await this.evaluationService.getEvaluationsById(id as unknown as ObjectId)
      res.status(200).json(evaluation)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  updateEvaluation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const data = req.body

      const evaluation = await this.evaluationService.updateEvaluation({ id: id as unknown as ObjectId, ...data })

      res.status(200).json(evaluation)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  deleteEvaluation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      await this.evaluationService.deleteEvaluation(id as unknown as ObjectId)
      res.status(204).json({
        message: 'Evaluation deleted'
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  addSubmission = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { submission } = req.body

      if ((submission as Submission).student == null) throw CustomError.badRequest('Student is required')
      if ((submission as Submission).answers.length === 0) throw CustomError.badRequest('Answers is required')

      const evaluation = await this.evaluationService.addSubmission(id as unknown as ObjectId, submission)

      res.status(200).json(evaluation)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  startEvaluation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { studentId } = req.body

      const response = await this.evaluationService.startEvaluation(id as unknown as ObjectId, studentId as unknown as ObjectId)

      res.status(200).json(response)
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
