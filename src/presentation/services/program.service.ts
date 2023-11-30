import { ProgramModel } from '../../data/models/program'
import { CustomError } from '../../domain/errors/custom.error'
import { type PaginationDto } from '../../domain/shared/pagination.dto'

interface CreateProgram {
  name: string
  description: string
  courses: string[]
}

export class ProgramService {
  async createProgram ({ name, description, courses }: CreateProgram): Promise<void> {
    const programExist = await ProgramModel.findOne({ name })

    if (programExist != null) {
      throw new Error('Program already exists')
    }

    try {
      const program = new ProgramModel({ name, description, courses })
      await program.save()
    } catch (error) {
      throw CustomError.internalServerError(`Error creating program: ${error as string}`)
    }
  }

  async getPrograms ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, programs] = await Promise.all([
        ProgramModel.countDocuments(),
        ProgramModel.find()
          .skip(page - 1 * limit)
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

  async getProgramById (id: string): Promise<any> {
    try {
      const program = await ProgramModel.findById(id).populate('courses')
      if (program == null) throw new Error('Program not found')

      return program
    } catch (error) {
      throw CustomError.internalServerError(`Error getting program: ${error as string}`)
    }
  }
}
