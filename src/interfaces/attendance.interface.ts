import type { ObjectId } from 'mongoose'

export interface Attendance {
  date: Date
  person: string
  onModel: string
  course: ObjectId
  status: 'present' | 'absent' | 'late' | 'excused'
}
