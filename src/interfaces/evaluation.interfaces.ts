import type { Question } from './question.interface'
import type { ObjectId } from 'mongoose'

export interface CreateEvaluation {
  title: string
  description: string
  dueDate: Date
  course: ObjectId
  type: string
  questions: Question[]
}

export interface UpdateEvaluation {
  id: ObjectId
  title?: string
  description?: string
  dueDate?: Date
  questions?: Question[]
}
