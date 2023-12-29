import { CustomError } from '../../domain/errors/custom.error'
import { ScheduleModel } from '../../data/models/schedule'

import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { Schedule } from '../../interfaces/schedule.interfaces'
import type { ObjectId } from 'mongoose'

export class ScheduleService {
  async createSchedule ({
    assignedStudents, courseInstances, name
  }: Schedule): Promise<any> {
    try {
      const schedule = await ScheduleModel.create({
        assignedStudents,
        courseInstances,
        name
      })

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
          .populate('assignedStudents')
          .populate('courseInstances')
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
        .populate('assignedStudents')
        .populate('courseInstances')

      if (schedule == null) throw CustomError.notFound('Schedule not found')

      return schedule
    } catch (error) {
      throw CustomError.internalServerError(`Error getting schedule: ${error as string}`)
    }
  }

  async updateSchedule (scheduleId: string, {
    assignedStudents, courseInstances, name
  }: Schedule): Promise<any> {
    try {
      const updateData: {
        assignedStudents?: ObjectId[]
        courseInstances?: ObjectId[]
        name?: string
      } = {}

      if (assignedStudents != null) updateData.assignedStudents = assignedStudents
      if (courseInstances != null) updateData.courseInstances = courseInstances
      if (name != null) updateData.name = name

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
}
