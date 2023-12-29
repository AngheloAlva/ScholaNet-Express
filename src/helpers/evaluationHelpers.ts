import { CustomError } from '../domain/errors/custom.error'
import { EvaluationModel } from '../data/models'

import type { Question } from '../interfaces/question.interfaces'
import type { ObjectId } from 'mongoose'

interface Answer {
  question: ObjectId
  answer: string[]
  score?: number
  feedback?: string
}

interface Evaluation {
  deleteOne: () => unknown
  save: () => unknown
  title: string
  description: string
  course: ObjectId
  dueDate: Date
  type: 'paper' | 'online' | 'presentation' | 'project'
  questions: Question[]
  submissions: Array<{
    student: ObjectId
    answers: Answer[]
    score?: number
    feedback?: string
  }>
}

export async function verifyEvaluationExists (evaluationId: ObjectId): Promise<Evaluation> {
  const evaluation = await EvaluationModel.findById(evaluationId)
  if (evaluation == null) throw CustomError.notFound('Evaluation not found')

  return evaluation as unknown as Evaluation
}
