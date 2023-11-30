/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { CustomError } from '../../domain/errors/custom.error'
import { type MaterialService } from '../services/material.service'
import { type Response, type Request } from 'express'

export class MaterialController {
  constructor (
    private readonly materialService: MaterialService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createMaterial = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { title, description, type, url, course } = req.body
      const newMaterial = await this.materialService.createMaterial({
        title,
        description,
        type,
        url,
        course
      })
      return res.status(201).json(newMaterial)
    } catch (error) {
      return this.handleError(error, res)
    }
  }

  getMaterials = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const materials = await this.materialService.getMaterials({
        page: Number(page),
        limit: Number(limit)
      })
      return res.status(200).json(materials)
    } catch (error) {
      return this.handleError(error, res)
    }
  }

  getMaterialById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params
      const material = await this.materialService.getMaterialById(id)
      return res.status(200).json(material)
    } catch (error) {
      return this.handleError(error, res)
    }
  }
}
