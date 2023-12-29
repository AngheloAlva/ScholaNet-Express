import type { ObjectId } from 'mongoose'

export interface Schedule {
  name: string
  courseInstances: ObjectId[]
  assignedStudents: ObjectId[]
}
