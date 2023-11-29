import mongoose, { Schema } from 'mongoose'

const studentSchema = new Schema({
  name: String,
  lastName: String,
  dateOfBirth: Date,
  password: String,
  rut: {
    type: String,
    unique: true
  },
  program: {
    type: String,
    enum: ['primary', 'secondary', 'special', 'workshop']
  }
})

export const StudentModel = mongoose.model('Student', studentSchema)
