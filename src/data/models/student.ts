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
    type: String,
    enum: ['primary', 'secondary', 'special', 'workshop'],
    required: true
  }
})

export const StudentModel = mongoose.model('Student', studentSchema)
