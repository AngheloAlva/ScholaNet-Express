import { CustomError } from '../../domain/errors/custom.error'
import { QuestionModel } from '../../data/models/question'
import { verifyEvaluationExists } from '../../helpers'

import type { Question, UpdateQuestion } from '../../interfaces/question.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { ObjectId } from 'mongoose'
import { EvaluationModel } from '../../data/models'

export class QuestionService {
  async createQuestion ({
    questions, evaluation
  }: { questions: Question[], evaluation: ObjectId }): Promise<any> {
    try {
      const evaluationExist = await verifyEvaluationExists(evaluation)

      const newQuestions = await QuestionModel.create(questions.map(question => ({
        ...question,
        evaluation
      })))

      evaluationExist.questions.push(...newQuestions.map(question => question._id.toString()))
      await evaluationExist.save()

      return newQuestions
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
      const evaluation = await EvaluationModel.findOne({ questions: questionId })
      if (evaluation == null) throw CustomError.notFound('Evaluation not found')

      const question = await QuestionModel.findByIdAndDelete(questionId)
      if (question == null) throw CustomError.notFound('Question not found')

      evaluation.questions = evaluation.questions.filter(question => !question.equals(String(questionId)))
      await evaluation.save()
    } catch (error) {
      throw CustomError.internalServerError(`Error deleting question: ${error as string}`)
    }
  }
}
