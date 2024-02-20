import mongoose, { Schema } from 'mongoose'

const submissionSchema = new Schema({
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
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  totalScore: Number,
  feedback: String,
  grade: Number
})

const evaluationSchema = new Schema({
  title: String,
  description: String,
  duration: Number,
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
  maxScore: Number,
  submissions: [submissionSchema]
})

export const EvaluationModel = mongoose.model('Evaluation', evaluationSchema)
