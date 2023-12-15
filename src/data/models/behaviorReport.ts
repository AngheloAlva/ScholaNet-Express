import mongoose, { Schema } from 'mongoose'

const behaviorReportSchema = new Schema({
  date: Date,
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  description: String,
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe']
  },
  resolved: {
    type: Boolean,
    default: false
  }
})

export const BehaviorReportModel = mongoose.model('BehaviorReport', behaviorReportSchema)
