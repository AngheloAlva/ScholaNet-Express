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
  schedule: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    startTime: String,
    endTime: String
  }]
})

export const CourseInstanceModel = mongoose.model('CourseInstance', courseInstanceSchema)
