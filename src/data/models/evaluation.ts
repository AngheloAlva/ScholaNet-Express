import mongoose, { Schema } from 'mongoose'

const evaluationSchema = new Schema({
  title: String,
  description: String,
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  dueDate: Date,
  type: {
    type: String,
    enum: ['paper', 'online', 'presentation', 'project']
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  submissions: [{
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    answers: [{
      answers: [String],
      score: Number,
      feedback: String,
      question: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
      }
    }],
    score: Number,
    feedback: String
  }]
})

export const EvaluationModel = mongoose.model('Evaluation', evaluationSchema)
