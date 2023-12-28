/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { CustomError } from '../../domain/errors/custom.error'
import { InscriptionModel } from '../../data/models/index'
import { verifyGuardianExist } from '../../helpers'
import { StudentService } from './student.service'
import bcrypt from 'bcrypt'

import type { CreateInscriptionProps } from '../../interfaces/inscription.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { ObjectId } from 'mongoose'

export class InscriptionService {
  async createInscription ({
    name, lastName, dateOfBirth, password, rut, program, guardian
  }: CreateInscriptionProps): Promise<unknown> {
    try {
      await verifyGuardianExist(guardian)

      const salt = await bcrypt.genSalt(10)
      password = await bcrypt.hash(password, salt)

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

  async getInscriptionById (id: ObjectId): Promise<any> {
    try {
      const inscription = await InscriptionModel.findById(id)
        .populate('student')
        .populate('program')

      if (!inscription) {
        throw CustomError.notFound('Inscription not found')
      }

      return inscription
    } catch (error) {
      throw CustomError.internalServerError(`Error getting inscription by id: ${error as string}`)
    }
  }
}
