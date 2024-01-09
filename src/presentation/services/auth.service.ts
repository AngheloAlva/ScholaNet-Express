import { CustomError } from '../../domain/errors/custom.error'
import { StudentModel, UserModel } from '../../data/models'
import { sendEmail } from '../../utils/sendGridMailer'
import { envs } from '../../config/envs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import type { LoginStudent, LoginUser } from '../../interfaces/user.interfaces'
import type { ObjectId } from 'mongoose'

export class AuthService {
  async loginUser ({ email, password }: LoginUser): Promise<any> {
    try {
      const user = await UserModel.findOne({ email })
      if (user == null) throw CustomError.notFound('User not found')
      if (!user.emailVefiried) throw CustomError.badRequest('User not verified')

      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) throw CustomError.badRequest('Invalid password')

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        envs.TOKEN_SECRET,
        { expiresIn: '30m' }
      )

      const refreshToken = jwt.sign(
        { userId: user._id, role: user.role },
        envs.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      )

      user.refreshToken = refreshToken
      await user.save()

      return { token, refreshToken }
    } catch (error) {
      throw CustomError.internalServerError(`Error logging in user: ${error as string}`)
    }
  }

  async refreshToken (refreshToken: string): Promise<any> {
    try {
      const decode = jwt.verify(refreshToken, envs.REFRESH_TOKEN_SECRET) as jwt.JwtPayload
      const user = await UserModel.findOne({ refreshToken })
      if (user == null) throw CustomError.notFound('User not found')

      return jwt.sign({ userId: decode.userId, role: decode.role }, envs.TOKEN_SECRET, { expiresIn: '30m' })
    } catch (error) {
      throw CustomError.internalServerError(`Error refreshing token: ${error as string}`)
    }
  }

  async verifyUser (email: string, code: string): Promise<any> {
    try {
      const user = await UserModel.findOne({ email })
      if (user == null) throw CustomError.notFound('User not found')

      if (user.verificationCode !== code) throw CustomError.badRequest('Invalid code')

      user.emailVefiried = true
      await user.save()

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        envs.TOKEN_SECRET,
        { expiresIn: '30m' }
      )

      const refreshToken = jwt.sign(
        { userId: user._id, role: user.role },
        envs.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      )

      return { token, refreshToken }
    } catch (error) {
      throw CustomError.internalServerError(`Error verifying user: ${error as string}`)
    }
  }

  async handlePasswordResetRequest (email: string): Promise<void> {
    try {
      const user = await UserModel.findOne({ email })
      if (user == null) throw CustomError.notFound('User not found')

      const resetToken = jwt.sign({ userId: user._id }, envs.TOKEN_SECRET, { expiresIn: '5m' })

      user.resetPasswordToken = resetToken
      await user.save()

      const resetLink = `${envs.CLIENT_URL}/auth/forgot-password?token=${resetToken}`
      const subject = 'Reset your password'
      const text = `Click on this link to reset your password: ${resetLink}`
      const html = `<p>Click on this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
      await sendEmail(email, subject, text, html)
    } catch (error) {
      throw CustomError.internalServerError(`Error requesting password reset: ${error as string}`)
    }
  }

  async resetPassword (token: string, password: string): Promise<void> {
    try {
      const decodedToken = jwt.verify(token, envs.TOKEN_SECRET) as { userId: ObjectId }
      const user = await UserModel.findById(decodedToken.userId)
      if (user == null) throw CustomError.notFound('User not found')

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      user.password = hashedPassword
      await user.save()
    } catch (error) {
      throw CustomError.internalServerError(`Error resetting password: ${error as string}`)
    }
  }

  async verifyToken (token: string): Promise<void> {
    try {
      jwt.verify(token, envs.TOKEN_SECRET, (error, decoded) => {
        if (error != null) throw CustomError.badRequest('Invalid token')

        return {
          valid: true,
          userId: (decoded as jwt.JwtPayload)?.userId
        }
      })
    } catch (error) {
      throw CustomError.internalServerError(`Error verifying token: ${error as string}`)
    }
  }

  async loginStudent ({ rut, password }: LoginStudent): Promise<any> {
    try {
      const student = await StudentModel.findOne({ rut })
      if (student == null) throw CustomError.notFound('Student not found')

      const validPassword = await bcrypt.compare(password, String(student.password))
      if (!validPassword) throw CustomError.badRequest('Invalid password')

      const token = jwt.sign(
        { userId: student._id },
        envs.TOKEN_SECRET,
        { expiresIn: '30m' }
      )

      const refreshToken = jwt.sign(
        { userId: student._id },
        envs.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      )

      student.refreshToken = refreshToken
      await student.save()

      return { token, refreshToken }
    } catch (error) {
      throw CustomError.internalServerError(`Error logging in student: ${error as string}`)
    }
  }
}
