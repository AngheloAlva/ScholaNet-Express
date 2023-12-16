import mongoose, { Schema } from 'mongoose'

const semesterSchema = new Schema({
  name: String,
  startDate: Date,
  endDate: Date
})

export const SemesterModel = mongoose.model('Semester', semesterSchema)
