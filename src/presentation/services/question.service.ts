import { CustomError } from '../../domain/errors/custom.error'
import { QuestionModel } from '../../data/models/question'
import { verifyEvaluationExists } from '../../helpers'

import type { Question, UpdateQuestion } from '../../interfaces/question.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { ObjectId } from 'mongoose'

export class QuestionService {
  async createQuestion ({
    questionText, options, correctAnswer, points, questionType, evaluation
  }: Question): Promise<any> {
    try {
      await verifyEvaluationExists(evaluation)

      const question = await QuestionModel.create({
        questionText,
        options,
        correctAnswer,
        points,
        questionType,
        evaluation
      })

      return question
    } catch (error) {
      throw CustomError.internalServerError(`Error creating question: ${error as string}`)
    }
  }

  async getQuestionsByEvaluation (evaluation: ObjectId, { limit, page }: PaginationDto): Promise<any> {
    try {
      await verifyEvaluationExists(evaluation)

      const [total, questions] = await Promise.all([
        QuestionModel.countDocuments({ evaluation }),
        QuestionModel.find({ evaluation })
          .limit(limit)
          .skip((page - 1) * limit)
      ])

      return {
        total,
        questions
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting questions: ${error as string}`)
    }
  }

  async getQuestionById (questionId: ObjectId): Promise<any> {
    try {
      const question = await QuestionModel.findById(questionId)
      if (question == null) throw CustomError.notFound('Question not found')

      return question
    } catch (error) {
      throw CustomError.internalServerError(`Error getting question: ${error as string}`)
    }
  }

  async updateQuestion ({
    questionId, questionText, options, correctAnswer, points, questionType, evaluation
  }: UpdateQuestion): Promise<any> {
    try {
      const updateData: {
        questionText?: string
        options?: string[]
        correctAnswer?: string
        points?: number
        questionType?: string
        evaluation?: ObjectId
      } = {}

      if (evaluation != null) {
        await verifyEvaluationExists(evaluation)
        updateData.evaluation = evaluation as any
      }

      if (options != null) updateData.options = options
      if (correctAnswer != null) updateData.correctAnswer = correctAnswer
      if (questionText != null) updateData.questionText = questionText
      if (points != null) updateData.points = points
      if (questionType != null) updateData.questionType = questionType

      const updatedQuestion = await QuestionModel.findByIdAndUpdate(questionId, updateData, {
        new: true
      })
      if (updatedQuestion == null) throw CustomError.notFound('Question not found')

      return updatedQuestion
    } catch (error) {
      throw CustomError.internalServerError(`Error updating question: ${error as string}`)
    }
  }

  async deleteQuestion (questionId: ObjectId): Promise<any> {
    try {
      const question = await QuestionModel.findByIdAndRemove(questionId)
      if (question == null) throw CustomError.notFound('Question not found')
    } catch (error) {
      throw CustomError.internalServerError(`Error deleting question: ${error as string}`)
    }
  }
}
