import mongoose, { Schema } from 'mongoose'

const scheduleSchema = new Schema({
  name: String,
  courseInstances: [{
    type: Schema.Types.ObjectId,
    ref: 'CourseInstance'
  }],
  assignedStudents: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }]
})

export const ScheduleModel = mongoose.model('Schedule', scheduleSchema)
