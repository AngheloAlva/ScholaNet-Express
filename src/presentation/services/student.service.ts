import bcrypt from 'bcrypt'

import { verifyProgramExists, verifyGuardianExist } from '../../helpers'
import { CustomError } from '../../domain/errors/custom.error'
import { StudentModel } from '../../data/models/index'

import type { CreateStudent, UpdateStudent } from '../../interfaces/student.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { ObjectId } from 'mongoose'
import type mongoose from 'mongoose'

export class StudentService {
  async createStudent ({
    name, lastName, dateOfBirth, password, rut, program, guardian
  }: CreateStudent): Promise<void> {
    try {
      const studentDB = await StudentModel.findOne({ rut })
      if (studentDB != null) throw CustomError.badRequest('Student already exists')

      const guardianExist = await verifyGuardianExist(guardian)
      await verifyProgramExists(program)

      const salt = await bcrypt.genSalt(10)
      password = await bcrypt.hash(password, salt)

      const student = new StudentModel({ name, lastName, dateOfBirth, password, rut, program })
      await student.save()

      guardianExist.students.push(student.id)
      await guardianExist.save()

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

  async updateStudent ({ id, password, program, guardian }: UpdateStudent): Promise<any> {
    try {
      const student = await StudentModel.findById(id)
      if (student == null) throw CustomError.notFound('Student not found')

      if (password != null) {
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)
        student.password = password
      }

      if (program != null) {
        await verifyProgramExists(program)
        student.program = program as unknown as mongoose.Types.ObjectId
      }

      if (guardian != null) {
        await verifyGuardianExist(guardian)
        student.guardian = guardian as unknown as mongoose.Types.ObjectId
      }

      await student.save()

      return student
    } catch (error) {
      throw CustomError.internalServerError(`Error updating student: ${error as string}`)
    }
  }

  async deleteStudent (id: ObjectId): Promise<void> {
    try {
      const student = await StudentModel.findById(id)
      if (student == null) throw CustomError.notFound('Student not found')

      student.state = 'inactive'
      await student.save()
    } catch (error) {
      throw CustomError.internalServerError(`Error deleting student: ${error as string}`)
    }
  }
}
