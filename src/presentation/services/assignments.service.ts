import { verifyAssignmentExists, verifyCourseExists } from '../../helpers/index'
import { AssignmentModel } from '../../data/models/index'
import { CustomError } from '../../domain/errors/custom.error'

import type { CreateAssignment, UpdateAssignment } from '../../interfaces/assignment.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { ObjectId } from 'mongoose'

export class AssignmentService {
  async createAssignment ({
    title, description, dueDate, course, type, score
  }: CreateAssignment): Promise<any> {
    try {
      await verifyCourseExists(course)

      const assignment = new AssignmentModel({
        title,
        description,
        dueDate,
        course,
        score,
        type
      })
      await assignment.save()

      return assignment
    } catch (error) {
      throw CustomError.internalServerError(`Error creating assignments: ${error as string}`)
    }
  }

  async getAssignments ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, assignments] = await Promise.all([
        AssignmentModel.countDocuments(),
        AssignmentModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('course')
      ])

      return {
        total,
        assignments
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting assignments: ${error as string}`)
    }
  }

  async getAssignmentsById (id: ObjectId): Promise<any> {
    try {
      const assignment = await verifyAssignmentExists(id)

      return assignment
    } catch (error) {
      throw CustomError.internalServerError(`Error getting assignment: ${error as string}`)
    }
  }

  async updateAssignment ({
    id, title, description, dueDate, score
  }: UpdateAssignment): Promise<any> {
    try {
      const assignment = await verifyAssignmentExists(id)

      if (title != null) assignment.title = title
      if (description != null) assignment.description = description
      if (dueDate != null) assignment.dueDate = dueDate
      if (score != null) assignment.score = score

      await assignment.save()

      return assignment
    } catch (error) {
      throw CustomError.internalServerError(`Error updating assignment: ${error as string}`)
    }
  }

  async deleteAssignment (id: ObjectId): Promise<any> {
    try {
      const assignment = await verifyAssignmentExists(id)

      await assignment.deleteOne()
    } catch (error) {
      throw CustomError.internalServerError(`Error deleting assignment: ${error as string}`)
    }
  }
}
