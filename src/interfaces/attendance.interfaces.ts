import type { ObjectId } from 'mongoose'

export interface Attendance {
  date: Date
  person: ObjectId
  onModel: string
  courseInstance: ObjectId
  status: 'present' | 'absent' | 'late' | 'excused'
}
