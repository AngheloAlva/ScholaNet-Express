import { CustomError } from '../../domain/errors/custom.error'

import type { SemesterService } from '../services/semester.service'
import type { Response, Request } from 'express'

export class SemesterController {
  constructor (
    private readonly semesterService: SemesterService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createSemester = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, startDate, endDate } = req.body
      const newSemester = await this.semesterService.createSemester({
        name,
        startDate,
        endDate
      })

      res.status(201).json(newSemester)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getSemesters = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const { total, semesters } = await this.semesterService.getSemesters({
        page: Number(page),
        limit: Number(limit)
      })

      res.status(200).json({
        total,
        semesters
      })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  updateSemester = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body
      const updatedSemester = await this.semesterService.updateSemester(data)

      res.status(200).json(updatedSemester)
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
