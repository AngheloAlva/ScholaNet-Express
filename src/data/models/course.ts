import { Schema, Model } from 'mongoose'

const courseSchema = new Schema({
  title: String,
  description: String,
  level: {
    type: String,
    enum: ['primary', 'secondary', 'special', 'workshop']
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

export const CourseModel = new Model('Course', courseSchema)
