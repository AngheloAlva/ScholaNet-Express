/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { CustomError } from '../../domain/errors/custom.error'

import { type MaterialService } from '../services/material.service'
import { type Response, type Request } from 'express'
import type { ObjectId } from 'mongoose'

export class MaterialController {
  constructor (
    private readonly materialService: MaterialService
  ) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message })
    }

    console.log(error as string)
    return res.status(500).json({ message: 'Internal server error' })
  }

  createMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, type, url, course } = req.body
      const newMaterial = await this.materialService.createMaterial({
        title,
        description,
        type,
        url,
        course
      })
      res.status(201).json(newMaterial)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getMaterials = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query
      const materials = await this.materialService.getMaterials({
        page: Number(page),
        limit: Number(limit)
      })
      res.status(200).json(materials)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getMaterialById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const material = await this.materialService.getMaterialById(id)
      res.status(200).json(material)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  updateMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const data = req.body

      const updatedMaterial = await this.materialService.updateMaterial({ id, ...data })

      res.status(200).json(updatedMaterial)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  deleteMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      await this.materialService.deleteMaterial(id as unknown as ObjectId)

      res.status(200).json({ message: 'Material deleted successfully' })
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
