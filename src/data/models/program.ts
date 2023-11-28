import { Schema, Model } from 'mongoose'

const programSchema = new Schema({
  name: String,
  description: String,
  courses: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }]
})

export const ProgramModel = new Model('Program', programSchema)
