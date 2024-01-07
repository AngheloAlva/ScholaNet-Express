import mongoose, { Schema } from 'mongoose'

const materialSchema = new Schema({
  title: String,
  description: String,
  type: {
    type: String,
    enum: ['pdf', 'link', 'video']
  },
  url: String,
  courseInstance: {
    type: Schema.Types.ObjectId,
    ref: 'CourseInstance'
  }
})

export const MaterialModel = mongoose.model('Material', materialSchema)
