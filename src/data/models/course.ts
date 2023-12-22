import mongoose, { Schema } from 'mongoose'

const courseSchema = new Schema({
  title: String,
  description: String,
  program: {
    type: Schema.Types.ObjectId,
    ref: 'Program'
  },
  image: String,
  href: String
})

export const CourseModel = mongoose.model('Course', courseSchema)
