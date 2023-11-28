/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { InscriptionModel } from '../../data/models/inscription'
import { CustomError } from '../../domain/errors/custom.error'

import type { CreateInscriptionDto } from '../../domain/dtos/inscription/create-inscription.dto'
import type { PaginationDto } from '../../domain/shared/pagination.dto'

export class InscriptionService {
  async createInscription (createInscription: CreateInscriptionDto): Promise<any> {
    const productExists = await InscriptionModel.findOne({
      student: createInscription.student,
      program: createInscription.program
    })

    if (productExists) throw CustomError.badRequest('Inscription already exists')

    try {
      const inscription = new InscriptionModel(createInscription)
      await inscription.save()
      return inscription
    } catch (error) {
      throw CustomError.internalServerError(`Error creating inscription: ${error as string}`)
    }
  }

  async getInscriptions (paginationDto: PaginationDto): Promise<any> {
    const { page, limit } = paginationDto

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
