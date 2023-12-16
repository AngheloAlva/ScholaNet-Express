import { verifyEvaluationExists, verifyCourseExists } from '../../helpers/index'
import { EvaluationModel } from '../../data/models/index'
import { CustomError } from '../../domain/errors/custom.error'

import type { CreateEvaluation, UpdateEvaluation } from '../../interfaces/evaluation.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { ObjectId } from 'mongoose'

export class EvaluationService {
  async createEvaluation ({
    title, description, dueDate, courseInstance, type, questions
  }: CreateEvaluation): Promise<any> {
    try {
      const courseInstanceExist = await verifyCourseExists(courseInstance)
      if (courseInstanceExist == null) throw CustomError.badRequest('Course Instance does not exist')

      const newEvaluation = new EvaluationModel({
        title,
        description,
        dueDate,
        courseInstance,
        type,
        questions
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

      if (evaluation == null) throw CustomError.notFound('Evaluation not found')

      return evaluation
    } catch (error) {
      throw CustomError.internalServerError(`Error getting Evaluation: ${error as string}`)
    }
  }

  async updateEvaluation ({
    id, title, description, dueDate, questions
  }: UpdateEvaluation): Promise<any> {
    try {
      const evaluation = await verifyEvaluationExists(id)

      if (title != null) evaluation.title = title
      if (description != null) evaluation.description = description
      if (dueDate != null) evaluation.dueDate = dueDate
      if (questions != null) evaluation.questions = questions

      await evaluation.save()

      return evaluation
    } catch (error) {
      throw CustomError.internalServerError(`Error updating Evaluation: ${error as string}`)
    }
  }

  async deleteEvaluation (id: ObjectId): Promise<any> {
    try {
      const evaluation = await verifyEvaluationExists(id)
      if (evaluation == null) throw CustomError.notFound('Evaluation not found')

      await evaluation.deleteOne()
    } catch (error) {
      throw CustomError.internalServerError(`Error deleting Evaluation: ${error as string}`)
    }
  }
}
