import { CourseModel, ProgramModel } from '../../data/models/index'
import { verifyCourseExists, verifyProgramExists } from '../../helpers/index'
import { CustomError } from '../../domain/errors/custom.error'

import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { CreateCourse, UpdateCourse } from '../../interfaces/course.interfaces'
import type { ObjectId } from 'mongoose'

export class CourseService {
  async createCourse ({
    title, description, program, image, href
  }: CreateCourse): Promise<any> {
    try {
      const courseExist = await CourseModel.findOne({ title })
      if (courseExist != null) throw CustomError.badRequest('Course already exists')

      await verifyProgramExists(program)

      const course = new CourseModel({ title, description, program, image, href })
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

  async updateCourse ({ id, title, description, image, href }: UpdateCourse): Promise<any> {
    try {
      const courseDb = await verifyCourseExists(id)

      if (title != null) courseDb.title = title
      if (description != null) courseDb.description = description
      if (image != null) courseDb.image = image
      if (href != null) courseDb.href = href

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
}
