/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { InscriptionModel } from '../../data/models/inscription'
import { CustomError } from '../../domain/errors/custom.error'
import type { PaginationDto } from '../../domain/shared/pagination.dto'

interface CreateInscriptionProps {
  student: string
  program: string
  status: string
  enrollmentDate: Date
}

export class InscriptionService {
  async createInscription (createInscription: CreateInscriptionProps): Promise<unknown> {
    const productExists = await InscriptionModel.findOne({
      studentId: createInscription.student,
      programId: createInscription.program
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
