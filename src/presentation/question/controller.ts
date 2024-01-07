import { CustomError } from '../../domain/errors/custom.error'

import type { Question } from '../../interfaces/question.interfaces'
import type { QuestionService } from '../services/question.service'
import type { Request, Response } from 'express'
import type { ObjectId } from 'mongoose'

export class QuestionController {
  constructor (
    private readonly questionService: QuestionService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { questions, evaluation }: { questions: Question[], evaluation: ObjectId } = req.body
      const newQuestion = await this.questionService.createQuestion({
        questions,
        evaluation
      })

      res.status(201).json(newQuestion)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getQuestionsByEvaluation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { evaluation } = req.params
      const { page = 1, limit = 10 } = req.query
      const { total, questions } = await this.questionService.getQuestionsByEvaluation(
        evaluation as unknown as ObjectId,
        {
          page: Number(page),
          limit: Number(limit)
        }
      )

      res.status(200).json({
        total,
        questions
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getQuestionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const question = await this.questionService.getQuestionById(id as unknown as ObjectId)

      res.status(200).json(question)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  updateQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const data = req.body
      const question = await this.questionService.updateQuestion({ id, ...data })

      res.status(200).json(question)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  deleteQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      await this.questionService.deleteQuestion(id as unknown as ObjectId)
      res.status(200).json({
        message: 'Question deleted successfully'
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
