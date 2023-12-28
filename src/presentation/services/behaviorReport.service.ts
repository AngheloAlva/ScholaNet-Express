import { CustomError } from '../../domain/errors/custom.error'
import { BehaviorReportModel, StudentModel } from '../../data/models'

import type { CreateBehaviorReport, UpdateBehaviorReport } from '../../interfaces/behaviorReport.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'

export class BehaviorReportService {
  async createBehaviorReport ({
    date, student, description, severity, resolved
  }: CreateBehaviorReport): Promise<any> {
    try {
      const studentExists = await StudentModel.findById(student)
      if (studentExists == null) throw CustomError.notFound('Student not found')

      const newBehaviorReport = await BehaviorReportModel.create({
        date,
        student,
        description,
        severity,
        resolved
      })

      return newBehaviorReport
    } catch (error) {
      throw CustomError.internalServerError(`Error creating behavior report: ${error as string}`)
    }
  }

  async getBehaviorReports ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, behaviorReports] = await Promise.all([
        BehaviorReportModel.countDocuments(),
        BehaviorReportModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('student')
      ])

      return {
        total,
        behaviorReports
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting behavior reports: ${error as string}`)
    }
  }

  async getBehaviorReportById (id: string): Promise<any> {
    try {
      const behaviorReport = await BehaviorReportModel.findById(id)
        .populate('student')

      if (behaviorReport == null) throw CustomError.notFound('Behavior report not found')

      return behaviorReport
    } catch (error) {
      throw CustomError.internalServerError(`Error getting behavior report: ${error as string}`)
    }
  }

  async getBehaviorReportsByStudent (studentId: string): Promise<any> {
    try {
      const student = await StudentModel.findById(studentId)
      if (student == null) throw CustomError.notFound('Student not found')

      const behaviorReports = await BehaviorReportModel.find({ student: studentId })

      return behaviorReports
    } catch (error) {
      throw CustomError.internalServerError(`Error getting behavior reports: ${error as string}`)
    }
  }

  async updateBehaviorReport ({
    id, description, severity, resolved
  }: UpdateBehaviorReport): Promise<any> {
    try {
      const behaviorReport = await BehaviorReportModel.findById(id)
      if (behaviorReport == null) throw CustomError.notFound('Behavior report not found')

      if (description != null) behaviorReport.description = description
      if (severity != null) behaviorReport.severity = severity
      if (resolved != null) behaviorReport.resolved = resolved

      await behaviorReport.save()

      return behaviorReport
    } catch (error) {
      throw CustomError.internalServerError(`Error updating behavior report: ${error as string}`)
    }
  }
}
