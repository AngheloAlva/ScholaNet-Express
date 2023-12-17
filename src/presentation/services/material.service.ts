import { CourseInstanceModel, MaterialModel } from '../../data/models/index'
import { CustomError } from '../../domain/errors/custom.error'

import type { CreateMaterial, UpdateMaterial } from '../../interfaces/material.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { ObjectId } from 'mongoose'

export class MaterialService {
  async createMaterial ({
    title, description, type, url, courseInstance
  }: CreateMaterial): Promise<any> {
    try {
      await CourseInstanceModel.findById(courseInstance)
      if (courseInstance == null) throw CustomError.notFound('Course instance not found')

      const material = new MaterialModel({
        title,
        description,
        type,
        url,
        courseInstance
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
          .populate('courseInstance')
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

  async updateMaterial ({
    id, title, description, type, url
  }: UpdateMaterial): Promise<any> {
    try {
      const material = await MaterialModel.findById(id)
      if (material == null) throw CustomError.notFound('Material not found')

      if (title != null) material.title = title
      if (description != null) material.description = description
      if (type != null) material.type = type
      if (url != null) material.url = url

      await material.save()

      return material
    } catch (error) {
      throw CustomError.internalServerError(`Error updating material: ${error as string}`)
    }
  }

  async deleteMaterial (id: ObjectId): Promise<any> {
    try {
      const material = await MaterialModel.findById(id)
      if (material == null) throw CustomError.notFound('Material not found')

      await material.deleteOne()
    } catch (error) {
      throw CustomError.internalServerError(`Error deleting material: ${error as string}`)
    }
  }
}
