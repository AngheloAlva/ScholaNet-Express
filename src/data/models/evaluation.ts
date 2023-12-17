import mongoose, { Schema } from 'mongoose'

const evaluationSchema = new Schema({
  title: String,
  description: String,
  courseInstance: {
    type: Schema.Types.ObjectId,
    ref: 'CourseInstance'
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
      question: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
      },
      answer: [String],
      score: Number,
      feedback: String
    }],
    totalScore: Number,
    feedback: String
  }]
})

export const EvaluationModel = mongoose.model('Evaluation', evaluationSchema)
