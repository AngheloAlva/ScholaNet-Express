import { CustomError } from '../../domain/errors/custom.error'
import { SemesterModel } from '../../data/models'

import type { PaginationDto } from '../../domain/shared/pagination.dto'

interface Semester {
  name: string
  startDate: Date
  endDate: Date
}

interface UpdateSemester {
  semesterId?: string
  name?: string
  startDate?: Date
  endDate?: Date
}

export class SemesterService {
  async createSemester ({
    name, startDate, endDate
  }: Semester): Promise<any> {
    try {
      const startDateObj = new Date(startDate)
      const endDateObj = new Date(endDate)

      if (startDate > endDate) throw CustomError.internalServerError('Start date must be before end date')
      if (startDateObj.getFullYear() !== endDateObj.getFullYear()) throw CustomError.internalServerError('Start and end dates must be in the same year')

      const semester = await SemesterModel.create({
        name,
        startDate,
        endDate
      })

      return semester
    } catch (error) {
      throw CustomError.internalServerError(`Error creating semester: ${error as string}`)
    }
  }

  async getSemesters ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, semesters] = await Promise.all([
        SemesterModel.countDocuments(),
        SemesterModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
      ])

      return {
        total,
        semesters
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting semesters: ${error as string}`)
    }
  }

  async getSemesterById (semesterId: string): Promise<any> {
    try {
      const semester = await SemesterModel.findById(semesterId)
      if (semester == null) throw CustomError.internalServerError('Semester not found')

      return semester
    } catch (error) {
      throw CustomError.internalServerError(`Error getting semester: ${error as string}`)
    }
  }

  async updateSemester ({
    semesterId, name, startDate, endDate
  }: UpdateSemester): Promise<any> {
    try {
      const updateData: {
        name?: string
        startDate?: Date
        endDate?: Date
      } = {}

      if ((startDate != null) && (endDate != null)) {
        const startDateObj = new Date(startDate)
        const endDateObj = new Date(endDate)

        if (startDate > endDate) throw CustomError.internalServerError('Start date must be before end date')
        if (startDateObj.getFullYear() !== endDateObj.getFullYear()) {
          throw CustomError.internalServerError('Start and end dates must be in the same year')
        }

        updateData.startDate = startDate
        updateData.endDate = endDate
      }

      if (name != null) updateData.name = name

      const updatedSemester = await SemesterModel.findByIdAndUpdate(semesterId, updateData, {
        new: true
      })
      if (updatedSemester == null) throw CustomError.internalServerError('Semester not found')

      return updatedSemester
    } catch (error) {
      throw CustomError.internalServerError(`Error updating semester: ${error as string}`)
    }
  }
}
