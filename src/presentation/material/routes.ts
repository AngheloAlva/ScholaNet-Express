/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { MaterialService } from '../services/material.service'
import { MaterialController } from './controller'
import { body, param } from 'express-validator'
import { validate } from '../../middlewares/validation.middleware'

export class MaterialRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new MaterialService()
    const controller = new MaterialController(service)

    router.get('/materials', controller.getMaterials)
    router.get('/material/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id is required'),
      validate
    ], controller.getMaterialById)

    router.post('/material', [
      body('title').isString().notEmpty().withMessage('Title is required'),
      body('description').isString().notEmpty().withMessage('Description is required'),
      body('type').isString().isIn(['pdf', 'link', 'file']).withMessage('Type is required, must be one of [pdf, link, file]'),
      body('url').isURL().notEmpty().withMessage('Url is required'),
      body('course').isMongoId().notEmpty().withMessage('Course is required'),
      validate
    ], controller.createMaterial)

    return router
  }
}
