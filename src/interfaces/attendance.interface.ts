import type { ObjectId } from 'mongoose'

export interface Attendance {
  date: Date
  person: string
  onModel: string
  courseInstance: ObjectId
  status: 'present' | 'absent' | 'late' | 'excused'
}
