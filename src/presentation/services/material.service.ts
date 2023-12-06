import { CourseModel, MaterialModel } from '../../data/models/index'
import { CustomError } from '../../domain/errors/custom.error'

import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { CreateMaterial } from '../../interfaces/material.interfaces'

export class MaterialService {
  async createMaterial ({
    title, description, type, url, course
  }: CreateMaterial): Promise<any> {
    try {
      await CourseModel.findById(course)

      const material = new MaterialModel({
        title,
        description,
        type,
        url,
        course
      })
      await material.save()

      return material
    } catch (error) {
      throw CustomError.internalServerError(`Error creating material: ${error as string}`)
    }
  }

  async getMaterials ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, materials] = await Promise.all([
        MaterialModel.countDocuments(),
        MaterialModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('course')
      ])
      return {
        total,
        materials
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting materials: ${error as string}`)
    }
  }

  async getMaterialById (id: string): Promise<any> {
    try {
      const material = await MaterialModel.findById(id)
      if (material == null) throw CustomError.notFound('Material not found')

      return material
    } catch (error) {
      throw CustomError.internalServerError(`Error getting material: ${error as string}`)
    }
  }
}
