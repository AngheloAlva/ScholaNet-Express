import type { ObjectId } from 'mongoose'

export interface Schedule {
  name: string
  days: [{
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
    blocks: [{
      startTime: string
      endTime: string
      courseInstance: ObjectId
      assignedStudents: ObjectId[]
    }]
  }]
}
