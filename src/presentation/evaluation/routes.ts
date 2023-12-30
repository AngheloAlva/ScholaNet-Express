/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { body, param } from 'express-validator'

import { EvaluationService } from '../services/evaluation.service'
import { validate } from '../../middlewares/validation.middleware'
import { idValidation } from '../validations/idValidation'
import { EvaluationController } from './controller'

export class EvaluationRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new EvaluationService()
    const controller = new EvaluationController(service)

    router.get('/evaluations', controller.getEvaluations)
    router.get('/evaluation/:id', idValidation, controller.getEvaluationById)

    router.post('/evaluation', [
      body('title').isString().notEmpty().withMessage('Title is required'),
      body('type').isString().isIn(['paper', 'online', 'presentation', 'project'])
        .withMessage('Type is required, and must be one of: paper, online, presentation, project'),
      body('description').isString().notEmpty().withMessage('Description is required'),
      body('dueDate').isString().notEmpty().withMessage('Due date is required'),
      body('courseInstance').isMongoId().notEmpty().withMessage('Course Instance is required'),
      validate
    ], controller.createEvaluation)
    router.post('/evaluation/submission/:id', [
      param('id').isMongoId().withMessage('Invalid evaluation ID'),
      body('submission.student').isMongoId().notEmpty().withMessage('Student ID is required'),
      body('submission.answers').isArray().notEmpty().withMessage('Answers are required'),
      body('submission.answers.*.question').isMongoId().withMessage('Question ID is required'),
      body('submission.answers.*.answer').isArray().withMessage('Answer content is required'),
      validate
    ], controller.addSubmission)
    router.post('/evaluation/submission/:submissionId/grade', [
      param('submissionId').isMongoId().withMessage('Invalid evaluation ID'),
      body('answers.*.id').isMongoId().withMessage('Answer ID is required'),
      body('answers.*.score').isNumeric().withMessage('Score is required'),
      body('answers.*.feedback').isString().withMessage('Feedback is required'),
      validate
    ], controller.gradeSubmission)

    router.put('/evaluation/:id', [
      param('id').isMongoId().optional().withMessage('Id is required'),
      body('title').isString().optional().withMessage('Title is required'),
      body('description').isString().optional().withMessage('Description is required'),
      body('dueDate').isString().optional().withMessage('Due date is required'),
      body('questions').isArray().optional().withMessage('Questions is required'),
      validate
    ], controller.updateEvaluation)

    router.delete('/evaluation/:id', idValidation, controller.deleteEvaluation)

    return router
  }
}
