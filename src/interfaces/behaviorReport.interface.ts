import type { ObjectId } from 'mongoose'

export interface CreateBehaviorReport {
  date: Date
  student: ObjectId
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  resolved: boolean
}

export interface UpdateBehaviorReport {
  id: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  resolved: boolean
}
