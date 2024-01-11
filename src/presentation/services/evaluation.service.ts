/* eslint-disable @typescript-eslint/no-base-to-string */
import { verifyEvaluationExists } from '../../helpers/index'
import { CustomError } from '../../domain/errors/custom.error'
import { CourseInstanceModel, EvaluationModel } from '../../data/models/index'

import type { CreateEvaluation, UpdateEvaluation } from '../../interfaces/evaluation.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { Question } from '../../interfaces/question.interfaces'
import type { ObjectId } from 'mongoose'

export interface Submission {
  student: ObjectId
  startTime: Date
  attempt: number
  endTime?: Date
  answers: Array<{
    answer: string[]
    score: number
    feedback: string
    question: ObjectId
  }>
  score?: number
  feedback?: string
}

export class EvaluationService {
  async createEvaluation ({
    title, description, dueDate, courseInstance, type, duration
  }: CreateEvaluation): Promise<any> {
    try {
      const courseInstanceExist = await CourseInstanceModel.findById(courseInstance)
      if (courseInstanceExist == null) throw CustomError.badRequest('Course Instance does not exist')

      const newEvaluation = new EvaluationModel({
        courseInstance,
        description,
        duration,
        dueDate,
        title,
        type
      })
      await newEvaluation.save()

      return newEvaluation
    } catch (error) {
      throw CustomError.internalServerError(`Error creating Evaluations: ${error as string}`)
    }
  }

  async getEvaluations ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, evaluations] = await Promise.all([
        EvaluationModel.countDocuments(),
        EvaluationModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('courseInstance')
      ])

      return {
        total,
        evaluations
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting Evaluations: ${error as string}`)
    }
  }

  async getEvaluationsById (id: ObjectId): Promise<any> {
    try {
      const evaluation = await EvaluationModel.findById(id)
        .populate('courseInstance')
        .populate('questions')

      if (evaluation == null) throw CustomError.notFound('Evaluation not found')

      return evaluation
    } catch (error) {
      throw CustomError.internalServerError(`Error getting Evaluation: ${error as string}`)
    }
  }

  async updateEvaluation ({
    id, title, description, dueDate, questions, duration
  }: UpdateEvaluation): Promise<any> {
    try {
      const updateData: {
        title?: string
        description?: string
        dueDate?: Date
        questions?: Question[]
        duration?: number
      } = {}

      if (title != null) updateData.title = title
      if (description != null) updateData.description = description
      if (dueDate != null) updateData.dueDate = dueDate
      if (questions != null) updateData.questions = questions
      if (duration != null) updateData.duration = duration

      const updatedEvaluation = await EvaluationModel.findByIdAndUpdate(id, updateData, {
        new: true
      })
      if (updatedEvaluation == null) throw CustomError.notFound('Evaluation not found')

      return updatedEvaluation
    } catch (error) {
      throw CustomError.internalServerError(`Error updating Evaluation: ${error as string}`)
    }
  }

  async deleteEvaluation (id: ObjectId): Promise<any> {
    try {
      const evaluation = await EvaluationModel.findByIdAndDelete(id)
      if (evaluation == null) throw CustomError.notFound('Evaluation not found')

      return evaluation
    } catch (error) {
      throw CustomError.internalServerError(`Error deleting Evaluation: ${error as string}`)
    }
  }

  async addSubmission (id: ObjectId, newSubmission: Submission): Promise<any> {
    try {
      const evaluation = await verifyEvaluationExists(id)

      const existingSubmissionIndex = evaluation.submissions.findIndex(sub =>
        sub.student.toString() === newSubmission.student.toString()
      )

      if (existingSubmissionIndex !== -1) {
        evaluation.submissions[existingSubmissionIndex] = newSubmission
      } else {
        evaluation.submissions.push(newSubmission)
      }

      await evaluation.save()

      return evaluation
    } catch (error) {
      throw CustomError.internalServerError(`Error adding submission: ${error as string}`)
    }
  }

  async gradeSubmission (
    submissionId: ObjectId, answers: Array<{ id: ObjectId, score: number, feedback: string }>
  ): Promise<any> {
    try {
      const evaluation = await EvaluationModel.findOne({ 'submissions._id': submissionId })
      if (evaluation == null) throw CustomError.notFound('Submission not found')

      let totalScore = 0
      const submission = (evaluation.submissions as any).id(submissionId)

      answers.forEach(answerData => {
        const answer = submission.answers.id(answerData.id)
        answer.score = answerData.score
        answer.feedback = answerData.feedback

        totalScore += answerData.score
      })

      const maxScore = evaluation.maxScore ?? 0
      const grade = (totalScore / maxScore) * 10

      submission.totalScore = totalScore

      submission.grade = grade

      await evaluation.save()

      return evaluation
    } catch (error) {
      throw CustomError.internalServerError(`Error grading submission: ${error as string}`)
    }
  }

  async startEvaluation (id: ObjectId, studentId: ObjectId): Promise<any> {
    try {
      const evaluation = await verifyEvaluationExists(id)

      const hasAttempted = evaluation.submissions.some(sub =>
        sub.student.toString() === studentId.toString()
      )

      if (hasAttempted) {
        throw CustomError.badRequest('You have already attempted this evaluation')
      }

      const startTime = new Date()
      const endTime = new Date(startTime.getTime() + evaluation.duration * 60000)

      const newSubmissions = {
        student: studentId,
        startTime,
        endTime
      }

      evaluation.submissions.push(newSubmissions as Submission)
      await evaluation.save()

      return { canDo: true, message: 'Evaluation started' }
    } catch (error) {
      throw CustomError.internalServerError(`Error starting evaluation: ${error as string}`)
    }
  }
}
