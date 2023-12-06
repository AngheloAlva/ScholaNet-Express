import { CustomError } from '../../domain/errors/custom.error'
import { verifyUserExists } from '../../helpers/userHelpers'
import { UserModel } from '../../data/models/index'

import type { UpdateUser, CreateUser } from '../../interfaces/user.interfaces'
import type { PaginationDto } from '../../domain/shared/pagination.dto'
import type { ObjectId } from 'mongoose'

export class UserService {
  async createUser ({
    name, lastName, rut, email, role
  }: CreateUser): Promise<any> {
    const userExist = await UserModel.findOne({ rut })

    if (userExist != null) {
      throw CustomError.badRequest('User already exists')
    }

    try {
      const user = new UserModel({ name, lastName, rut, email, role })
      await user.save()

      return user
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
}
