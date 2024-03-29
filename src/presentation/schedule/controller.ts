import { CustomError } from '../../domain/errors/custom.error'

import type { ScheduleService } from '../services/schedule.service'
import type { Request, Response } from 'express'

export class ScheduleController {
  constructor (
    private readonly scheduleService: ScheduleService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, days } = req.body
      const newSchedule = await this.scheduleService.createSchedule({
        name,
        days
      })

      res.status(201).json(newSchedule)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getSchedules = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit } = req.query

      const { total, schedules } = await this.scheduleService.getSchedules({
        limit: Number(limit),
        page: Number(page)
      })

      res.status(200).json({
        total,
        schedules
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getScheduleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const schedule = await this.scheduleService.getScheduleById(id)

      res.status(200).json(schedule)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  updateSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { name, days } = req.body
      const updatedSchedule = await this.scheduleService.updateSchedule(id, {
        name,
        days
      })

      res.status(200).json(updatedSchedule)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  deleteSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const { scheduleId } = req.params
      await this.scheduleService.deleteSchedule(scheduleId)

      res.status(204).end()
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getCoursesWithoutSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const courseInstances = await this.scheduleService.getCoursesWithoutSchedule()

      res.status(200).json(courseInstances)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getScheduleByStudentId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const schedule = await this.scheduleService.getScheduleByStudentId(id)

      res.status(200).json(schedule)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  addStudentsToSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { students } = req.body
      const schedule = await this.scheduleService.addStudentsToSchedule(id, students)

      res.status(200).json(schedule)
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
