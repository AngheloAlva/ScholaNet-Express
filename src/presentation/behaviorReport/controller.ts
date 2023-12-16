import { CustomError } from '../../domain/errors/custom.error'

import type { BehaviorReportService } from '../services/behaviorReport.service'
import type { Request, Response } from 'express'

export class BehaviorReportController {
  constructor (
    private readonly behaviorReportService: BehaviorReportService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createBehaviorReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { date, student, description, severity, resolved } = req.body
      const newBehaviorReport = await this.behaviorReportService.createBehaviorReport({
        date,
        student,
        description,
        severity,
        resolved
      })

      res.status(201).json(newBehaviorReport)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getBehaviorReports = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 5 } = req.query
      const { total, behaviorReports } = await this.behaviorReportService.getBehaviorReports({
        page: Number(page),
        limit: Number(limit)
      })

      res.status(200).json({ total, behaviorReports })
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getBehaviorReportById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const behaviorReport = await this.behaviorReportService.getBehaviorReportById(id)

      res.status(200).json(behaviorReport)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  updateBehaviorReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, description, severity, resolved } = req.body
      const behaviorReport = await this.behaviorReportService.updateBehaviorReport({
        id,
        description,
        severity,
        resolved
      })

      res.status(200).json(behaviorReport)
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
