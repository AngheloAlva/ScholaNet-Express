import { AssignmentModel } from '../../data/models/assignment'
import { CourseModel } from '../../data/models/course'
import { CustomError } from '../../domain/errors/custom.error'
import { type PaginationDto } from '../../domain/shared/pagination.dto'

interface CreateAssignment {
  title: string
  description: string
  dueDate: Date
  course: string
  type: string
  score: number
}

interface UpdateAssignment {
  id: string
  title?: string
  description?: string
  dueDate?: Date
  score?: number
}

export class AssignmentService {
  async createAssignment ({
    title, description, dueDate, course, type, score
  }: CreateAssignment): Promise<any> {
    try {
      const courseExist = await CourseModel.findById(course)
      if (courseExist == null) throw CustomError.badRequest('Course does not exist')

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

  async getAssignmentsById (id: string): Promise<any> {
    try {
      const assignment = await AssignmentModel.findById(id)
      if (assignment == null) throw CustomError.notFound('Assignment not found')

      return assignment
    } catch (error) {
      throw CustomError.internalServerError(`Error getting assignment: ${error as string}`)
    }
  }

  async updateAssignment ({
    id, title, description, dueDate, score
  }: UpdateAssignment): Promise<any> {
    try {
      const assignment = await AssignmentModel.findById(id)
      if (assignment == null) throw CustomError.notFound('Assignment not found')

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

  async deleteAssignment (id: string): Promise<any> {
    try {
      const assignment = await AssignmentModel.findById(id)
      if (assignment == null) throw CustomError.notFound('Assignment not found')

      await assignment.deleteOne()
    } catch (error) {
      throw CustomError.internalServerError(`Error deleting assignment: ${error as string}`)
    }
  }
}
