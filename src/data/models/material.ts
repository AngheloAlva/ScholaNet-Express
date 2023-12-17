import mongoose, { Schema } from 'mongoose'

const materialSchema = new Schema({
  title: String,
  description: String,
  type: {
    type: String,
    enum: ['pdf', 'link', 'file']
  },
  url: String,
  courseInstance: {
    type: Schema.Types.ObjectId,
    ref: 'CourseInstance'
  }
})

export const MaterialModel = mongoose.model('Material', materialSchema)
