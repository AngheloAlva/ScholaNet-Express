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
  },
  state: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  attendances: [{
    type: Schema.Types.ObjectId,
    ref: 'Attendance'
  }],
  evaluations: [{
    type: Schema.Types.ObjectId,
    ref: 'Evaluation'
  }],
  behaviorReports: [{
    type: Schema.Types.ObjectId,
    ref: 'BehaviorReport'
  }],
  courseInstances: [{
    type: Schema.Types.ObjectId,
    ref: 'CourseInstance'
  }]
})

export const StudentModel = mongoose.model('Student', studentSchema)
