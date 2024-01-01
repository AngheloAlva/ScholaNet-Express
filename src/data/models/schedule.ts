import mongoose, { Schema } from 'mongoose'

const blockSchema = new Schema({
  startTime: String,
  endTime: String,
  courseInstance: {
    type: Schema.Types.ObjectId,
    ref: 'CourseInstance'
  },
  assignedStudents: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }]
})

const daySchema = new Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  blocks: [blockSchema]
})

const scheduleSchema = new Schema({
  name: String,
  days: [daySchema]
})

export const ScheduleModel = mongoose.model('Schedule', scheduleSchema)
