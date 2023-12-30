import mongoose, { Schema } from 'mongoose'

const attendanceSchema = new Schema({
  date: Date,
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
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
