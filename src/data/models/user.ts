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
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['guardian', 'teacher', 'admin'],
    default: 'guardian'
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  state: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  verificationCode: String,
  emailVefiried: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  refreshToken: String
})

export const UserModel = mongoose.model('User', userSchema)
