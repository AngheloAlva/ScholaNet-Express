/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import type { Request, Response } from 'express'
import type { InscriptionService } from '../services/inscriptions.service'
import { CustomError } from '../../domain/errors/custom.error'

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

  createInscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const inscriptionData = req.body
      const newInscription = await this.inscriptionService.createInscription(inscriptionData)
      res.status(201).json(newInscription)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getInscriptions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const inscriptions = await this.inscriptionService.getInscriptions({
        page: Number(page),
        limit: Number(limit)
      })
      res.status(200).json(inscriptions)
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
