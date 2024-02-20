import type { ObjectId } from 'mongoose'

export interface Attendance {
  date: Date
  person: ObjectId
  courseInstance: ObjectId
  student?: ObjectId
  teacher?: ObjectId
  status: 'present' | 'absent' | 'late' | 'excused'
}
