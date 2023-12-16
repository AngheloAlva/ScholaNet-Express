import { CourseInstanceModel, SemesterModel } from '../../data/models'
import { CustomError } from '../../domain/errors/custom.error'
import { verifyCourseExists, verifyTeacherExists } from '../../helpers'

import type { CreateCourseInstance, UpdateCourseInstance } from '../../interfaces/courseInstance.interface'
import type { PaginationDto } from '../../domain/shared/pagination.dto'

export class CourseInstanceService {
  async createCourseInstance ({
    academicYear, classroom, course, schedule, semester, teacher
  }: CreateCourseInstance): Promise<any> {
    try {
      await verifyCourseExists(course)
      await verifyTeacherExists(teacher)
      const semesterExist = await SemesterModel.findById(semester)
      if (semesterExist == null) throw CustomError.badRequest('Semester does not exist')

      const courseInstance = new CourseInstanceModel({
        academicYear, classroom, course, schedule, semester, teacher
      })
      await courseInstance.save()

      return courseInstance
    } catch (error) {
      throw CustomError.internalServerError(`Error creating course instance: ${error as string}`)
    }
  }

  async getCoursesInstances ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, coursesInstances] = await Promise.all([
        CourseInstanceModel.countDocuments(),
        CourseInstanceModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('course')
          .populate('teacher')
          .populate('semester')
      ])

      return {
        total,
        coursesInstances
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting courses instances: ${error as string}`)
    }
  }

  async getCourseInstanceById (id: string): Promise<any> {
    try {
      const courseInstance = await CourseInstanceModel.findById(id)
        .populate('course')
        .populate('teacher')
        .populate('semester')
        .populate('students')

      return courseInstance
    } catch (error) {
      throw CustomError.internalServerError(`Error getting course instance: ${error as string}`)
    }
  }

  async updateCourseInstance ({
    classroom, schedule, teacher, id
  }: UpdateCourseInstance): Promise<any> {
    try {
      const courseInstance = await CourseInstanceModel.findById(id)
      if (courseInstance == null) throw CustomError.badRequest('Course instance does not exist')

      if (classroom != null) courseInstance.classroom = classroom
      if (schedule != null) courseInstance.schedule = schedule
      if (teacher != null) courseInstance.teacher = teacher as any

      await courseInstance.save()

      return courseInstance
    } catch (error) {
      throw CustomError.internalServerError(`Error updating course instance: ${error as string}`)
    }
  }

  async addStudentToCourseInstance (courseInstanceId: string, studentId: string): Promise<any> {
    try {
      const courseInstance = await CourseInstanceModel.findById(courseInstanceId)
      if (courseInstance == null) throw CustomError.badRequest('Course instance does not exist')

      courseInstance.students.push(studentId as any)
      await courseInstance.save()

      return courseInstance
    } catch (error) {
      throw CustomError.internalServerError(`Error adding student to course instance: ${error as string}`)
    }
  }
}
