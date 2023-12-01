import { ProgramModel } from '../../data/models/program'
import { StudentModel } from '../../data/models/student'
import { UserModel } from '../../data/models/user'
import { CustomError } from '../../domain/errors/custom.error'
import { type PaginationDto } from '../../domain/shared/pagination.dto'

interface CreateStudent {
  name: string
  lastName: string
  dateOfBirth: Date
  password: string
  rut: string
  program: string
  guardian: string
}

export class StudentService {
  async createStudent ({
    name, lastName, dateOfBirth, password, rut, program, guardian
  }: CreateStudent): Promise<void> {
    const studentDB = await StudentModel.findOne({ rut })
    if (studentDB == null) throw CustomError.badRequest('Student does not exist')

    const guardianExist = await UserModel.findById(guardian).where({ role: 'guardian' })
    if (guardianExist == null) throw CustomError.badRequest('Guardian does not exist')

    const programExist = await ProgramModel.findById(program)
    if (programExist == null) throw CustomError.badRequest('Program does not exist')

    try {
      const student = new StudentModel({ name, lastName, dateOfBirth, password, rut, program })
      await student.save()

      return student.id
    } catch (error) {
      throw CustomError.internalServerError(`Error creating user: ${error as string}`)
    }
  }

  async getStudents ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, students] = await Promise.all([
        StudentModel.countDocuments(),
        StudentModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
      ])
      return {
        total,
        students
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting students: ${error as string}`)
    }
  }

  async getStudentById (id: string): Promise<any> {
    try {
      const student = await StudentModel.findById(id)
      if (student == null) throw CustomError.notFound('Student not found')

      return student
    } catch (error) {
      throw CustomError.internalServerError(`Error getting student: ${error as string}`)
    }
  }
}
