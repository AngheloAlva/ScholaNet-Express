/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import type { Request, Response } from 'express'
import type { InscriptionService } from '../services/inscriptions.service'
import { CustomError } from '../../domain/errors/custom.error'
import { CreateInscriptionDto } from '../../domain/dtos/inscription/create-inscription.dto'
import { PaginationDto } from '../../domain/shared/pagination.dto'

export class InscriptionController {
  constructor (
    private readonly inscriptionService: InscriptionService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createInscription = (req: Request, res: Response): undefined | Response => {
    const [error, createInscriptionDto] = CreateInscriptionDto.create({
      ...req.body,
      student: req.body.studentId,
      program: req.body.programId
    })

    if (error) return res.status(400).json({ message: error })

    this.inscriptionService.createInscription(createInscriptionDto!)
      .then((inscription) => res.status(201).json(inscription))
      .catch((error) => this.handleError(error, res))
  }

  getInscriptions = (req: Request, res: Response): undefined | Response => {
    const { page = 1, limit = 10 } = req.query
    const [error, paginationDto] = PaginationDto.create(Number(page), Number(limit))

    if (error) return res.status(400).json({ message: error })

    this.inscriptionService.getInscriptions(paginationDto!)
      .then((inscriptions) => res.status(200).json(inscriptions))
      .catch((error) => this.handleError(error, res))
  }
}
