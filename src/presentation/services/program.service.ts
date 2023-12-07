import { CustomError } from '../../domain/errors/custom.error'
import { ProgramModel } from '../../data/models/index'
import { verifyProgramExists } from '../../helpers'

import type { CreateProgram, UpdateProgram } from '../../interfaces/program.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { ObjectId } from 'mongoose'

export class ProgramService {
  async createProgram ({ name, description }: CreateProgram): Promise<any> {
    const programExist = await ProgramModel.findOne({ name })
    if (programExist != null) {
      throw CustomError.badRequest('Program already exists')
    }

    try {
      const program = new ProgramModel({ name, description })
      await program.save()

      return program
    } catch (error) {
      throw CustomError.internalServerError(`Error creating program: ${error as string}`)
    }
  }

  async getPrograms ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, programs] = await Promise.all([
        ProgramModel.countDocuments(),
        ProgramModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('courses')
      ])
      return {
        total,
        programs
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting programs: ${error as string}`)
    }
  }

  async getProgramById (id: ObjectId): Promise<any> {
    try {
      const program = await ProgramModel.findById(id).populate('courses')
      if (program == null) throw CustomError.notFound('Program not found')

      return program
    } catch (error) {
      throw CustomError.internalServerError(`Error getting program: ${error as string}`)
    }
  }

  async updateProgram ({ id, name, description, courses }: UpdateProgram): Promise<any> {
    try {
      const program = await verifyProgramExists(id)

      if (name != null) program.name = name
      if (description != null) program.description = description
      if (courses != null) program.courses = courses

      await program.save()

      return program
    } catch (error) {
      throw CustomError.internalServerError(`Error updating program: ${error as string}`)
    }
  }
}
