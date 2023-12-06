import { UserModel } from '../data/models/user'
import { CustomError } from '../domain/errors/custom.error'
import { type User } from '../interfaces/user.interfaces'
import { type ObjectId } from 'mongoose'

export async function verifyTeacherExists (teacherId: ObjectId): Promise<User> {
  const teacherExist = await UserModel.findById(teacherId).where({ role: 'teacher' })
  if (teacherExist == null) throw CustomError.badRequest('Teacher does not exist')

  return teacherExist as unknown as User
}

export async function verifyGuardianExist (guardianId: ObjectId): Promise<User> {
  const guardianExist = await UserModel.findById(guardianId).where({ role: 'guardian' })
  if (guardianExist == null) throw CustomError.badRequest('Guardian does not exist')

  return guardianExist as unknown as User
}

export async function verifyUserExists (userId: ObjectId): Promise<User> {
  const userExist = await UserModel.findById(userId)
  if (userExist == null) throw CustomError.notFound('User not found')

  return userExist as unknown as User
}
