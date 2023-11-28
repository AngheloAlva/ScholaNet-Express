import { Schema, Model } from 'mongoose'

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

export const MaterialModel = new Model('Material', materialSchema)
