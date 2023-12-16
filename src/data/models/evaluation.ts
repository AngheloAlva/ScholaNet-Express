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
