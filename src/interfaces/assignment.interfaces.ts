import { type ObjectId } from 'mongoose'

export interface CreateAssignment {
  title: string
  description: string
  dueDate: Date
  course: ObjectId
  type: string
  score: number
}

export interface UpdateAssignment {
  id: ObjectId
  title?: string
  description?: string
  dueDate?: Date
  score?: number
}
