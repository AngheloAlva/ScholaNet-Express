/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { CustomError } from '../../domain/errors/custom.error'
import { type ProgramService } from '../services/program.service'
import { type Response } from 'express'

export class ProgramController {
  constructor (
    private readonly programServise: ProgramService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createProgram = async (req: any, res: Response): Promise<Response> => {
    try {
      const { name, description, courses } = req.body
      const newProgram = await this.programServise.createProgram({
        name,
        description,
        courses
      })
      return res.status(201).json(newProgram)
    } catch (error) {
      return this.handleError(error, res)
    }
  }

  getPrograms = async (req: any, res: Response): Promise<Response> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const programs = await this.programServise.getPrograms({
        page: Number(page),
        limit: Number(limit)
      })
      return res.status(200).json(programs)
    } catch (error) {
      return this.handleError(error, res)
    }
  }

  getProgramById = async (req: any, res: Response): Promise<Response> => {
    try {
      const { id } = req.params
      const program = await this.programServise.getProgramById(id)
      return res.status(200).json(program)
    } catch (error) {
      return this.handleError(error, res)
    }
  }
}
