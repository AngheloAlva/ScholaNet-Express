import mongoose, { Schema } from 'mongoose'

const materialSchema = new Schema({
  title: String,
  description: String,
  type: {
    type: String,
    enum: ['pdf', 'link', 'file']
  },
  url: String,
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }
})

export const MaterialModel = mongoose.model('Material', materialSchema)
