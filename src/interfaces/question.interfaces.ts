import type { ObjectId } from 'mongoose'

export interface Question {
  questionText: string
  options: string[]
  correctAnswer: string
  points: number
  questionType: 'multipleChoice' | 'trueFalse' | 'shortAnswer'
  evaluation: ObjectId
}

export interface UpdateQuestion {
  questionId?: ObjectId
  questionText?: string
  options?: string[]
  correctAnswer?: string
  points?: number
  questionType?: 'multipleChoice' | 'trueFalse' | 'shortAnswer'
  evaluation?: ObjectId
}
