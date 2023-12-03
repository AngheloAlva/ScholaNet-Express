import mongoose, { Schema } from 'mongoose'

const studentSchema = new Schema({
  name: String,
  lastName: String,
  dateOfBirth: Date,
  password: String,
  guardian: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rut: {
    type: String,
    unique: true
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: 'Program'
  }
})

export const StudentModel = mongoose.model('Student', studentSchema)
