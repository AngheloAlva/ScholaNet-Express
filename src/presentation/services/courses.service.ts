import { CourseModel, ProgramModel, MaterialModel } from '../../data/models/index'
import { verifyCourseExists, verifyProgramExists } from '../../helpers/index'
import { CustomError } from '../../domain/errors/custom.error'
import { AssignmentModel } from '../../data/models/assignment'
import { verifyTeacherExists } from '../../helpers/userHelpers'

import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { CreateCourse } from '../../interfaces/course.interfaces'
import type { ObjectId } from 'mongoose'

export class CourseService {
  async createCourse ({
    title, description, program, teacher, image, href
  }: CreateCourse): Promise<any> {
    try {
      const courseExist = await CourseModel.findOne({ title })
      if (courseExist != null) throw CustomError.badRequest('Course already exists')

      await verifyTeacherExists(teacher)
      await verifyProgramExists(program)

      const course = new CourseModel({ title, description, program, teacher, image, href })
      await course.save()

      await ProgramModel.findByIdAndUpdate(program, {
        $push: { courses: course.id }
      })

      return course
    } catch (error) {
      throw CustomError.internalServerError(`Error creating course: ${error as string}`)
    }
  }

  async getCourses ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, courses] = await Promise.all([
        CourseModel.countDocuments(),
        CourseModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('teacher')
      ])
      return {
        total,
        courses
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting courses: ${error as string}`)
    }
  }

  async getCourseById (id: ObjectId): Promise<any> {
    try {
      const course = await verifyCourseExists(id)

      return course
    } catch (error) {
      throw CustomError.internalServerError(`Error getting course: ${error as string}`)
    }
  }

  async updateCourse ({ id, title, description, program, teacher, image, href }: CreateCourse): Promise<any> {
    try {
      const courseDb = await verifyCourseExists(id as ObjectId)

      if (title != null) courseDb.title = title
      if (description != null) courseDb.description = description
      if (image != null) courseDb.image = image
      if (href != null) courseDb.href = href

      if (program != null) {
        await verifyProgramExists(program)
        courseDb.program = program as any
      }

      if (teacher != null) {
        await verifyTeacherExists(teacher)
        courseDb.teacher = teacher as any
      }

      await courseDb.save()

      return courseDb
    } catch (error) {
      throw CustomError.internalServerError(`Error updating course: ${error as string}`)
    }
  }

  async deleteCourse (id: ObjectId): Promise<any> {
    try {
      const courseDb = await verifyCourseExists(id)

      await Promise.all([
        CourseModel.findByIdAndDelete(id),
        ProgramModel.findByIdAndUpdate(courseDb.program, {
          $pull: { courses: id }
        })
      ])

      return courseDb
    } catch (error) {
      throw CustomError.internalServerError(`Error deleting course: ${error as string}`)
    }
  }

  async getAssignmentsByCourse (courseId: ObjectId): Promise<any> {
    try {
      await verifyCourseExists(courseId)

      const assignments = await AssignmentModel.find({ course: courseId })
      if (assignments == null) throw CustomError.notFound('Assignments not found')

      return assignments
    } catch (error) {
      throw CustomError.internalServerError(`Error getting assignments: ${error as string}`)
    }
  }

  async getMaterialsByCourse (courseId: ObjectId): Promise<any> {
    try {
      await verifyCourseExists(courseId)

      const materials = await MaterialModel.find({ course: courseId })
      if (materials == null) throw CustomError.notFound('Materials not found')

      return materials
    } catch (error) {
      throw CustomError.internalServerError(`Error getting materials: ${error as string}`)
    }
  }
}
