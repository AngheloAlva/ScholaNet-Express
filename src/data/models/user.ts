import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  name: String,
  lastName: String,
  rut: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  role: {
    type: String,
    enum: ['guardian', 'teacher', 'admin']
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }]
})

export const UserModel = mongoose.model('User', userSchema)
