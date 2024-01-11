import type { Question } from './question.interfaces'
import type { ObjectId } from 'mongoose'

export interface CreateEvaluation {
  title: string
  description: string
  dueDate: Date
  courseInstance: ObjectId
  type: string
  duration: number
}

export interface UpdateEvaluation {
  id: ObjectId
  title?: string
  description?: string
  dueDate?: Date
  questions?: Question[]
  duration?: number
}
