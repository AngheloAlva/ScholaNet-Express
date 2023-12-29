import { AttendanceModel, CourseInstanceModel, StudentModel, UserModel } from '../../data/models'
import { verifyUserExistByRole } from '../../helpers/userHelpers'
import { CustomError } from '../../domain/errors/custom.error'
import { verifyCourseExists } from '../../helpers'

import type { Attendance } from '../../interfaces/attendance.interfaces'
import type { ObjectId } from 'mongoose'

export class AttendanceService {
  async createAttendance ({
    date, person, onModel, courseInstance, status
  }: Attendance): Promise<any> {
    try {
      const courseInstanceExist = await CourseInstanceModel.findById(courseInstance)
      if (courseInstanceExist == null) throw CustomError.badRequest('Course instance does not exist')

      await verifyUserExistByRole(person, onModel)

      const attendance = new AttendanceModel({
        date,
        person,
        onModel,
        courseInstance,
        status
      })

      await attendance.save()

      if (onModel === 'Student') {
        await StudentModel.findByIdAndUpdate(person, {
          $push: { attendances: attendance._id }
        })
      } else if (onModel === 'Teacher') {
        await UserModel.findByIdAndUpdate(person, {
          $push: { attendances: attendance._id }
        })
      }

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

      const attendances = await AttendanceModel.find({ person })
        .populate('person')
        .populate('course')

      return attendances
    } catch (error) {
      throw CustomError.internalServerError(`Error getting attendance: ${error as string}`)
    }
  }
}
