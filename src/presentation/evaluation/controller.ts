/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { CustomError } from '../../domain/errors/custom.error'

import type { EvaluationService } from '../services/evaluation.service'
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
      const { title, description, dueDate, courseInstance, type, questions } = req.body
      const newEvaluation = await this.evaluationService.createEvaluation({
        title,
        description,
        dueDate,
        courseInstance,
        type,
        questions
      })
      res.status(201).json(newEvaluation)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getEvaluations = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const evaluation = await this.evaluationService.getEvaluations({
        page: Number(page),
        limit: Number(limit)
      })
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
}
