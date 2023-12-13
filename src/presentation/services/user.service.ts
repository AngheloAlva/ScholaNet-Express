import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { CustomError } from '../../domain/errors/custom.error'
import { verifyUserExists } from '../../helpers/userHelpers'
import { UserModel } from '../../data/models/index'

import type { UpdateUser, CreateUser, LoginUser } from '../../interfaces/user.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { ObjectId } from 'mongoose'
import { envs } from '../../config/envs'
import { generateVerificationCode } from '../../helpers/verificationCodeGenerator'
import { sendEmail } from '../../utils/sendGridMailer'

export class UserService {
  async createUser ({
    name, lastName, rut, email, password
  }: CreateUser): Promise<any> {
    try {
      const existingUser = await UserModel.findOne({ email, state: 'active' })
      if ((existingUser != null) && !existingUser?.emailVefiried) {
        await UserModel.deleteOne({ email })
      }

      const userByRut = await UserModel.findOne({ rut })
      if (userByRut != null) throw CustomError.badRequest('User with this rut already exists')

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      const verificationCode = generateVerificationCode()

      const newUser = new UserModel({
        name,
        lastName,
        rut,
        email,
        password: hashedPassword,
        verificationCode,
        emailVefiried: false
      })

      await newUser.save()

      const subject = 'Verify your email'
      const text = `Your verification code is: ${verificationCode}`
      const html = `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
      await sendEmail(email, subject, text, html)

      return newUser
    } catch (error) {
      throw CustomError.internalServerError(`Error creating user: ${error as string}`)
    }
  }

  async getUsers ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, users] = await Promise.all([
        UserModel.countDocuments(),
        UserModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
      ])
      return {
        total,
        users
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting users: ${error as string}`)
    }
  }

  async getUserById (id: ObjectId): Promise<any> {
    try {
      const user = await verifyUserExists(id)
      return user
    } catch (error) {
      throw CustomError.internalServerError(`Error getting user: ${error as string}`)
    }
  }

  async getUserByRut (rut: string): Promise<any> {
    try {
      const user = await UserModel.findOne({ rut })
      if (user == null) throw CustomError.notFound('User not found')

      return user
    } catch (erorr) {
      throw CustomError.internalServerError(`Error getting user: ${erorr as string}`)
    }
  }

  async updateUser ({ id, name, lastName, email }: UpdateUser): Promise<any> {
    try {
      const userExist = await verifyUserExists(id)

      if (name != null) userExist.name = name
      if (lastName != null) userExist.lastName = lastName
      if (email != null) userExist.email = email

      await userExist.save()

      return userExist
    } catch (error) {
      throw CustomError.internalServerError(`Error updating user: ${error as string}`)
    }
  }

  async deleteUser (id: ObjectId): Promise<void> {
    try {
      const userExist = await verifyUserExists(id)
      userExist.state = 'inactive'

      await userExist.save()
    } catch (error) {
      throw CustomError.internalServerError(`Error deleting user: ${error as string}`)
    }
  }

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

      const resetLink = `${envs.CLIENT_URL}/reset-password/${resetToken}`
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

  async checkUserStatus (email: string): Promise<{ exist: boolean, verified?: boolean }> {
    try {
      const user = await UserModel.findOne({ email })
      if (user == null) return { exist: false }

      return { exist: true, verified: user.emailVefiried }
    } catch (error) {
      throw CustomError.internalServerError(`Error checking user status: ${error as string}`)
    }
  }
}
