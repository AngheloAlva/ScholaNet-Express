import mongoose, { Schema } from 'mongoose'

const taskSchema = new Schema({
  title: String,
  description: String,
  dueDate: Date,
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
    score: Number,
    feedback: String
  }]
})

export const TaskModel = mongoose.model('Task', taskSchema)
