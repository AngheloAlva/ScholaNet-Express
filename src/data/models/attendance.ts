import mongoose, { Schema } from 'mongoose'

const attendanceSchema = new Schema({
  date: Date,
  person: {
    type: Schema.Types.ObjectId,
    ref: 'onModel'
  },
  onModel: {
    type: String,
    enum: ['Student', 'Teacher']
  },
  courseInstance: {
    type: Schema.Types.ObjectId,
    ref: 'CourseInstance'
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused']
  }
})

export const AttendanceModel = mongoose.model('Attendance', attendanceSchema)
