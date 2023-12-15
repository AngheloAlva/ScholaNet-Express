import mongoose, { Schema } from 'mongoose'

const questionSchema = new Schema({
  questionText: String,
  options: [String],
  correctAnswer: String,
  points: Number,
  questionType: {
    type: String,
    enum: ['multipleChoice', 'trueFalse', 'shortAnswer']
  },
  evaluation: {
    type: Schema.Types.ObjectId,
    ref: 'Evaluation'
  }
})

export const QuestionModel = mongoose.model('Question', questionSchema)
