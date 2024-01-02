import { CourseInstanceModel, ScheduleModel } from '../../data/models'
import { CustomError } from '../../domain/errors/custom.error'

import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { Schedule } from '../../interfaces/schedule.interfaces'
import type { ObjectId } from 'mongoose'

export class ScheduleService {
  async createSchedule ({
    name, days
  }: Schedule): Promise<any> {
    try {
      const session = await ScheduleModel.startSession()
      session.startTransaction()

      const courseInstances = days.flatMap(day => day.blocks.map(block => block.courseInstance))

      const existingCourseInstances = await CourseInstanceModel.find({
        _id: { $in: courseInstances }
      }).session(session)

      if (existingCourseInstances.length !== courseInstances.length) {
        throw CustomError.badRequest('Course instance not found')
      }

      const schedule = await ScheduleModel.create({
        days,
        name
      })

      await CourseInstanceModel.updateMany({
        _id: { $in: courseInstances }
      }, {
        schedule: schedule._id
      }, { session })

      await session.commitTransaction()
      void session.endSession()

      return schedule
    } catch (error) {
      throw CustomError.internalServerError(`Error creating schedule: ${error as string}`)
    }
  }

  async getSchedules ({ limit, page }: PaginationDto): Promise<any> {
    try {
      const [total, schedules] = await Promise.all([
        ScheduleModel.countDocuments(),
        ScheduleModel.find()
          .populate({
            path: 'days.blocks.courseInstance',
            populate: { path: 'course' }
          })
          .skip((page - 1) * limit)
          .limit(limit)
      ])

      return {
        total,
        schedules
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting schedules: ${error as string}`)
    }
  }

  async getScheduleById (scheduleId: string): Promise<any> {
    try {
      const schedule = await ScheduleModel.findById(scheduleId)
        .populate({
          path: 'days.blocks.courseInstance',
          populate: { path: 'course' }
        })
        .populate('days.blocks.assignedStudents')

      if (schedule == null) throw CustomError.notFound('Schedule not found')

      return schedule
    } catch (error) {
      throw CustomError.internalServerError(`Error getting schedule: ${error as string}`)
    }
  }

  async updateSchedule (scheduleId: string, {
    name, days
  }: Schedule): Promise<any> {
    try {
      const updateData: {
        name?: string
        days?: [{
          day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
          blocks: [{
            startTime: string
            endTime: string
            courseInstance: ObjectId
            assignedStudents: ObjectId[]
          }]
        }]
      } = {}

      if (name != null) updateData.name = name
      if (days != null) updateData.days = days

      const updatedSchedule = await ScheduleModel.findByIdAndUpdate(scheduleId, updateData, {
        new: true
      })
      if (updatedSchedule == null) throw CustomError.notFound('Schedule not found')

      return updatedSchedule
    } catch (error) {
      throw CustomError.internalServerError(`Error updating schedule: ${error as string}`)
    }
  }

  async deleteSchedule (scheduleId: string): Promise<any> {
    try {
      const deletedSchedule = await ScheduleModel.findByIdAndDelete(scheduleId)
      if (deletedSchedule == null) throw CustomError.notFound('Schedule not found')
    } catch (error) {
      throw CustomError.internalServerError(`Error deleting schedule: ${error as string}`)
    }
  }

  async getCoursesWithoutSchedule (): Promise<any> {
    try {
      const coursesWithoutSchedule = await CourseInstanceModel.find({
        schedule: { $exists: false }
      })
        .populate('course')
        .populate('teacher')

      return coursesWithoutSchedule
    } catch (error) {
      throw CustomError.internalServerError(`Error getting courses without schedule: ${error as string}`)
    }
  }
}
