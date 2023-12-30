import { AttendanceModel, CourseInstanceModel, StudentModel, UserModel } from '../../data/models'
import { CustomError } from '../../domain/errors/custom.error'
import { verifyCourseExists } from '../../helpers'

import type { Attendance } from '../../interfaces/attendance.interfaces'
import type { ObjectId } from 'mongoose'

export class AttendanceService {
  async createAttendance ({
    date, person, courseInstance, status
  }: Attendance): Promise<any> {
    try {
      const courseInstanceExist = await CourseInstanceModel.findById(courseInstance)
      if (courseInstanceExist == null) throw CustomError.badRequest('Course instance does not exist')

      const teacherExist = await UserModel.findById(person).where('role').equals('teacher')
      const studentExist = await StudentModel.findById(person)

      if ((teacherExist == null) && (studentExist == null)) throw CustomError.badRequest('Person does not exist')

      let attendance
      if (studentExist != null) {
        attendance = new AttendanceModel({
          date,
          student: person,
          courseInstance,
          status
        })
      } else {
        attendance = new AttendanceModel({
          date,
          teacher: person,
          courseInstance,
          status
        })
      }

      await attendance.save()

      return attendance
    } catch (error) {
      throw CustomError.internalServerError(`Error getting evaluations: ${error as string}`)
    }
  }

  async getAttendancesByCourse (course: ObjectId): Promise<any> {
    try {
      await verifyCourseExists(course)

      const attendances = await AttendanceModel.find({ course })
        .populate('person')
        .populate('course')

      return attendances
    } catch (error) {
      throw CustomError.internalServerError(`Error getting attendances: ${error as string}`)
    }
  }

  async getAttendanceByPerson (person: ObjectId): Promise<any> {
    try {
      const studentExist = await StudentModel.findById(person)
      const teacherExist = await UserModel.findById(person).where('role').equals('teacher')

      if ((studentExist == null) && (teacherExist == null)) throw CustomError.badRequest('Person does not exist')

      const attendances = await AttendanceModel.find({
        $or: [{ student: person }, { teacher: person }]
      })

      return attendances
    } catch (error) {
      throw CustomError.internalServerError(`Error getting attendance: ${error as string}`)
    }
  }
}
