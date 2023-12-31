import mongoose, { Schema } from 'mongoose'

const inscriptionSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: 'Program'
  },
  status: {
    type: String,
    enum: ['enrolled', 'completed', 'cancelled']
  },
  enrollmentDate: Date
})

export const InscriptionModel = mongoose.model('Inscription', inscriptionSchema)
