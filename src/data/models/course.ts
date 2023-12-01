import mongoose, { Schema } from 'mongoose'

const courseSchema = new Schema({
  title: String,
  description: String,
  program: {
    type: Schema.Types.ObjectId,
    ref: 'Program'
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

export const CourseModel = mongoose.model('Course', courseSchema)
