/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { InscriptionModel } from '../../data/models/inscription'
import { CustomError } from '../../domain/errors/custom.error'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import { StudentService } from './student.service'

interface CreateInscriptionProps {
  name: string
  lastName: string
  dateOfBirth: Date
  password: string
  rut: string
  program: string
  guardian: string
}

export class InscriptionService {
  async createInscription ({
    name, lastName, dateOfBirth, password, rut, program, guardian
  }: CreateInscriptionProps): Promise<unknown> {
    const studentService = new StudentService()
    const studentId = await studentService.createStudent({
      name,
      lastName,
      dateOfBirth,
      password,
      rut,
      program,
      guardian
    })

    try {
      const inscription = new InscriptionModel({
        student: studentId,
        program
      })
      await inscription.save()
      return inscription
    } catch (error) {
      throw CustomError.internalServerError(`Error creating inscription: ${error as string}`)
    }
  }

  async getInscriptions ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, inscriptions] = await Promise.all([
        InscriptionModel.countDocuments(),
        InscriptionModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('student')
          .populate('program')
      ])

      return {
        total,
        inscriptions
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting inscriptions: ${error as string}`)
    }
  }
}
