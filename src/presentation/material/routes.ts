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
    router.get('/materials/:id', [
      param('id').isString(),
      validate
    ], controller.getMaterialById)

    router.post('/materials', [
      body('title').isString(),
      body('description').isString(),
      body('type').isString(),
      body('url').isString(),
      body('course').isString(),
      validate
    ], controller.createMaterial)

    return router
  }
}
