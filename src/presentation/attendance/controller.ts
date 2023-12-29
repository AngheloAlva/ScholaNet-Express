import { CustomError } from '../../domain/errors/custom.error'

import type { AttendanceService } from '../services/attendance.service'
import type { Attendance } from '../../interfaces/attendance.interfaces'
import type { Response, Request } from 'express'
import type { ObjectId } from 'mongoose'

export class AttendanceController {
  constructor (
    private readonly attendanceService: AttendanceService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
      const { date, courseInstance, onModel, person, status }: Attendance = req.body
      const newAttendance = await this.attendanceService.createAttendance({
        date,
        courseInstance,
        onModel,
        person,
        status
      })

      res.status(201).json(newAttendance)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getAttendancesByCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { course } = req.params
      const attendances = await this.attendanceService.getAttendancesByCourse(course as unknown as ObjectId)

      res.status(200).json(attendances)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getAttendanceByPerson = async (req: Request, res: Response): Promise<void> => {
    try {
      const { personId } = req.params
      const attendances = await this.attendanceService.getAttendanceByPerson(personId as unknown as ObjectId)

      res.status(200).json(attendances)
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
