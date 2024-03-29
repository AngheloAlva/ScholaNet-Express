import { CourseInstanceModel, CourseModel, EvaluationModel, MaterialModel, SemesterModel, StudentModel } from '../../data/models'
import { verifyCourseExists, verifyTeacherExists } from '../../helpers'
import { CustomError } from '../../domain/errors/custom.error'

import type { CreateCourseInstance, UpdateCourseInstance } from '../../interfaces/courseInstance.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { ObjectId } from 'mongoose'

export class CourseInstanceService {
  async createCourseInstance ({
    academicYear, classroom, course, semester, teacher
  }: CreateCourseInstance): Promise<any> {
    try {
      await verifyCourseExists(course)
      await verifyTeacherExists(teacher)
      const semesterExist = await SemesterModel.findById(semester)
      if (semesterExist == null) throw CustomError.badRequest('Semester does not exist')

      const courseInstance = new CourseInstanceModel({
        academicYear, classroom, course, semester, teacher
      })
      await courseInstance.save()

      await CourseModel.findByIdAndUpdate(course, {
        $push: { courseInstances: courseInstance._id }
      })

      return courseInstance
    } catch (error) {
      throw CustomError.internalServerError(`Error creating course instance: ${error as string}`)
    }
  }

  async getCourseInstances ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, courseInstances] = await Promise.all([
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
        courseInstances
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
        .populate('schedule')
        .populate('attendances')
        .populate('evaluations')

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

      const updateData: {
        classroom?: string
        schedule?: Array<{
          day: string
          startTime: string
          endTime: string
          duration: number
        }>
        teacher?: string
      } = {}

      if (classroom != null) updateData.classroom = classroom
      if (schedule != null) updateData.schedule = schedule
      if (teacher != null) updateData.teacher = teacher as any

      const updatedCourseInstance = await CourseInstanceModel.findByIdAndUpdate(id, updateData, {
        new: true
      })

      return updatedCourseInstance
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

      await StudentModel.findByIdAndUpdate(studentId, {
        $push: { courseInstances: courseInstance._id }
      })

      return courseInstance
    } catch (error) {
      throw CustomError.internalServerError(`Error adding student to course instance: ${error as string}`)
    }
  }

  async getEvaluationsByCourseInstance (id: ObjectId): Promise<any> {
    try {
      const courseInstance = await CourseInstanceModel.findById(id)
      if (courseInstance == null) throw CustomError.notFound('Course instance not found')

      const evaluations = await EvaluationModel.find({ courseInstance: id })
        .populate('courseInstance')
      if (evaluations == null) throw CustomError.notFound('Evaluations not found')

      return evaluations
    } catch (error) {
      throw CustomError.internalServerError(`Error getting evaluations: ${error as string}`)
    }
  }

  async getMaterialsByCourseInstance (id: ObjectId): Promise<any> {
    try {
      const courseInstance = await CourseInstanceModel.findById(id)
      if (courseInstance == null) throw CustomError.notFound('Course instance not found')

      const materials = await MaterialModel.find({ courseInstance: id })
      if (materials == null) throw CustomError.notFound('Materials not found')

      return materials
    } catch (error) {
      throw CustomError.internalServerError(`Error getting materials: ${error as string}`)
    }
  }

  async getAverageGradeByStudent (courseInstanceId: ObjectId, studentId: ObjectId): Promise<any> {
    try {
      const evaluations = await EvaluationModel.find({ courseInstance: courseInstanceId })
      if (evaluations == null) throw CustomError.notFound('Evaluations not found')

      let totalGrades = 0
      let countGrades = 0

      evaluations.forEach(evaluation => {
        const submission = evaluation.submissions.find(submission =>
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          submission?.student?.toString() === studentId.toString()
        )
        if ((submission != null) && submission.grade !== null) {
          totalGrades += submission?.grade ?? 0
          countGrades++
        }
      })

      if (countGrades === 0) throw CustomError.notFound('Grades not found')

      const averageGrade = totalGrades / countGrades

      return averageGrade
    } catch (error) {
      throw CustomError.internalServerError(`Error getting average grade: ${error as string}`)
    }
  }

  async getCourseInstancesByTeacher (id: ObjectId, academicYear: string): Promise<any> {
    try {
      const today = new Date()
      const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' })

      const courseInstances = await CourseInstanceModel.find({
        teacher: id,
        academicYear
      })
        .populate('course')
        .populate('semester')
        .populate({
          path: 'schedule',
          match: { 'days.day': dayOfWeek },
          populate: {
            path: 'days.blocks.courseInstance',
            model: 'CourseInstance'
          }
        })

      if (courseInstances == null) throw CustomError.notFound('Course instances not found')

      const schedules = courseInstances
        .map(courseInstance => {
          if (courseInstance.schedule != null) {
            return (courseInstance.schedule as any).days
              .filter((day: { day: string }) => day.day === 'Monday')
              .flatMap((day: { blocks: any }) => day.blocks)
          }
          return []
        })
        .flat()
        .sort((a, b) => a.startTime.localeCompare(b.startTime))

      return {
        courseInstances,
        schedules
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting course instances: ${error as string}`)
    }
  }
}
