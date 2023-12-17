/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { validate } from '../../middlewares/validation.middleware'
import { QuestionService } from '../services/question.service'
import { idValidation } from '../validations/idValidation'
import { QuestionController } from './controller'
import { body, param } from 'express-validator'
import { Router } from 'express'

export class QuestionRoutes {
  static get routes (): Router {
    const router = Router()
    const service = new QuestionService()
    const controller = new QuestionController(service)

    router.get('/question/:id', idValidation, controller.getQuestionById)
    router.get('/questions/evaluation/:evaluation', [
      param('evaluation').isMongoId().notEmpty().withMessage('Evaluation is required'),
      validate
    ], controller.getQuestionsByEvaluation)

    router.post('/question', [
      body('questionText').isString().notEmpty().withMessage('Question text is required'),
      body('options').isArray().notEmpty().withMessage('Options are required'),
      body('correctAnswer').isString().notEmpty().withMessage('Correct answer is required'),
      body('points').isNumeric().notEmpty().withMessage('Points are required'),
      body('questionType').isString().notEmpty().isIn(['multipleChoice', 'trueFalse', 'shortAnswer']).withMessage('Question type is required and must be one of the following: multipleChoice, trueFalse, shortAnswer'),
      body('evaluation').isMongoId().notEmpty().withMessage('Evaluation is required'),
      validate
    ], controller.createQuestion)

    router.put('/question/:id', [
      param('id').isMongoId().notEmpty().withMessage('Id must be a valid MongoId'),
      body('questionText').optional().isString().withMessage('Question text must be a string'),
      body('options').optional().isArray().withMessage('Options must be an array'),
      body('correctAnswer').optional().isString().withMessage('Correct answer must be a string'),
      body('points').optional().isNumeric().withMessage('Points must be a number'),
      body('questionType').optional().isString().isIn(['multipleChoice', 'trueFalse', 'shortAnswer']).withMessage('Question type must be one of the following: multipleChoice, trueFalse, shortAnswer'),
      body('evaluation').optional().isMongoId().withMessage('Evaluation must be a valid MongoId'),
      validate
    ], controller.updateQuestion)

    router.delete('/question/:id', idValidation, controller.deleteQuestion)

    return router
  }
}
