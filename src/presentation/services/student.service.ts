import { StudentModel } from '../../data/models/student'
import { CustomError } from '../../domain/errors/custom.error'
import { type PaginationDto } from '../../domain/shared/pagination.dto'

interface CreateStudent {
  name: string
  lastName: string
  dateOfBirth: Date
  password: string
  rut: string
  program: string
}

export class StudentService {
  async createStudent ({
    name, lastName, dateOfBirth, password, rut, program
  }: CreateStudent): Promise<void> {
    const userExist = await StudentModel.findOne({ rut })

    if (userExist != null) {
      throw new Error('User already exists')
    }

    try {
      const user = new StudentModel({ name, lastName, dateOfBirth, password, rut, program })
      await user.save()
    } catch (error) {
      throw CustomError.internalServerError(`Error creating user: ${error as string}`)
    }
  }

  async getStudents ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, students] = await Promise.all([
        StudentModel.countDocuments(),
        StudentModel.find()
          .skip(page - 1 * limit)
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
      if (student == null) throw new Error('Student not found')

      return student
    } catch (error) {
      throw CustomError.internalServerError(`Error getting student: ${error as string}`)
    }
  }
}
