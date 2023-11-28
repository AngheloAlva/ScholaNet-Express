import { Schema, Model } from 'mongoose'

const evaluationSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  title: String,
  description: String,
  dueDate: Date,
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

export const EvaluationModel = new Model('Evaluation', evaluationSchema)
