import mongoose, { Schema } from 'mongoose'

const courseInstanceSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  semester: {
    type: Schema.Types.ObjectId,
    ref: 'Semester'
  },
  academicYear: String,
  classroom: String,
  schedule: {
    type: Schema.Types.ObjectId,
    ref: 'Schedule'
  },
  attendances: [{
    type: Schema.Types.ObjectId,
    ref: 'Attendance'
  }],
  evaluations: [{
    type: Schema.Types.ObjectId,
    ref: 'Evaluation'
  }]
})

export const CourseInstanceModel = mongoose.model('CourseInstance', courseInstanceSchema)
