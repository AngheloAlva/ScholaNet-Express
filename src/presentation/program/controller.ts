/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { CustomError } from '../../domain/errors/custom.error'

import type { ProgramService } from '../services/program.service'
import type { Request, Response } from 'express'
import type { ObjectId } from 'mongoose'

export class ProgramController {
  constructor (
    private readonly programServise: ProgramService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createProgram = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description } = req.body
      const newProgram = await this.programServise.createProgram({
        name,
        description
      })
      res.status(201).json(newProgram)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getPrograms = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const programs = await this.programServise.getPrograms({
        page: Number(page),
        limit: Number(limit)
      })
      res.status(200).json(programs)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getProgramById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const program = await this.programServise.getProgramById(id as unknown as ObjectId)
      res.status(200).json(program)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  updateProgram = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { name, description, courses } = req.body

      const program = await this.programServise.updateProgram({
        id: id as unknown as ObjectId,
        name,
        description,
        courses
      })

      res.status(200).json(program)
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
