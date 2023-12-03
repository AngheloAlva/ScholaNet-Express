import mongoose, { Schema } from 'mongoose'

const assignmentSchema = new Schema({
  title: String,
  description: String,
  dueDate: Date,
  type: {
    type: String,
    enum: ['task', 'evaluation']
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  submissions: [{
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student'
    },
    fileUrl: String,
    feedback: String
  }],
  score: {
    type: Number,
    required: false,
    default: 0
  }
})

export const AssignmentModel = mongoose.model('Assignment', assignmentSchema)
