import { UserModel } from '../../data/models/user'
import { CustomError } from '../../domain/errors/custom.error'
import { type PaginationDto } from '../../domain/shared/pagination.dto'

interface CreateUser {
  name: string
  lastName: string
  rut: string
  email: string
  role: string
  students: string[]
}

export class UserService {
  async createUser ({
    name, lastName, rut, email, role, students
  }: CreateUser): Promise<void> {
    const userExist = await UserModel.findOne({ rut })

    if (userExist != null) {
      throw new Error('User already exists')
    }

    try {
      const user = new UserModel({ name, lastName, rut, email, role, students })
      await user.save()
    } catch (error) {
      throw CustomError.internalServerError(`Error creating user: ${error as string}`)
    }
  }

  async getUsers ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, users] = await Promise.all([
        UserModel.countDocuments(),
        UserModel.find()
          .skip(page - 1 * limit)
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

  async getUserById (id: string): Promise<any> {
    try {
      const user = await UserModel.findById(id)
      if (user == null) throw new Error('User not found')

      return user
    } catch (error) {
      throw CustomError.internalServerError(`Error getting user: ${error as string}`)
    }
  }
}
