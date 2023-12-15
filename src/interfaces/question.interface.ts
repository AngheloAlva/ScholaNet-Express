import type { ObjectId } from 'mongoose'

export interface Question {
  questionText: string
  options: string[]
  correctAnswer: string
  points: number
  questionType: 'multipleChoice' | 'trueFalse' | 'shortAnswer'
  evaluation: ObjectId
}
