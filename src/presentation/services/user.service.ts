import { CourseInstanceModel, StudentModel, UserModel } from '../../data/models/index'
import { generateVerificationCode } from '../../helpers/verificationCodeGenerator'
import { verifyGuardianExist, verifyUserExists } from '../../helpers/userHelpers'
import { CustomError } from '../../domain/errors/custom.error'
import { sendEmail } from '../../utils/sendGridMailer'
import bcrypt from 'bcrypt'

import type { UpdateUser, CreateUser } from '../../interfaces/user.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { ObjectId } from 'mongoose'

export class UserService {
  async createUser ({
    name, lastName, rut, email, password
  }: CreateUser): Promise<any> {
    try {
      const existingUser = await UserModel.findOne({ email })
      if ((existingUser != null) && !existingUser?.emailVefiried) {
        await UserModel.deleteOne({ email })
      }

      const userByRut = await UserModel.findOne({ rut })
      if ((userByRut != null) && userByRut.emailVefiried) throw CustomError.badRequest('User with this rut already exists')

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

  async getTeachers (): Promise<any> {
    try {
      const [total, teachers] = await Promise.all([
        UserModel.countDocuments({ role: 'teacher' }),
        UserModel.find({ role: 'teacher' })
      ])
      return {
        total,
        teachers
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting teachers: ${error as string}`)
    }
  }

  async getStudentsByGuardian (guardianId: ObjectId): Promise<any> {
    try {
      const guardian = await verifyGuardianExist(guardianId)
      const students = await StudentModel.find({ guardian: guardian._id })
        .populate('program')

      return students
    } catch (error) {
      throw CustomError.internalServerError(`Error getting students: ${error as string}`)
    }
  }

  async updateUser ({ id, name, lastName, email }: UpdateUser): Promise<any> {
    try {
      const updateData: {
        name?: string
        lastName?: string
        email?: string
      } = {}

      if (name != null) updateData.name = name
      if (lastName != null) updateData.lastName = lastName
      if (email != null) updateData.email = email

      const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
        new: true
      })
      if (updatedUser == null) throw CustomError.notFound('User not found')

      return updatedUser
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

  async getCoursesInstancesByTeacher (teacherId: ObjectId): Promise<any> {
    try {
      const teacher = await UserModel.findById(teacherId)
      if (teacher == null) throw CustomError.notFound('Teacher not found')

      const coursesInstances = await CourseInstanceModel.find({ teacher: teacherId })
        .populate('course')
        .populate('teacher')
        .populate('semester')

      return coursesInstances
    } catch (error) {
      throw CustomError.internalServerError(`Error getting courses instances: ${error as string}`)
    }
  }
}
