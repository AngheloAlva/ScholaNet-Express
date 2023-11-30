import { CourseModel } from '../../data/models/course'
import { CustomError } from '../../domain/errors/custom.error'
import { type PaginationDto } from '../../domain/shared/pagination.dto'

interface CreateCourse {
  title: string
  description: string
  level: string
  teacher: string
}

export class CourseService {
  async createCourse ({
    title, description, level, teacher
  }: CreateCourse): Promise<void> {
    const courseExist = await CourseModel.findOne({ title })

    if (courseExist != null) {
      throw new Error('Course already exists')
    }

    try {
      const course = new CourseModel({ title, description, level, teacher })
      await course.save()
    } catch (error) {
      throw CustomError.internalServerError(`Error creating course: ${error as string}`)
    }
  }

  async getCourses ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, courses] = await Promise.all([
        CourseModel.countDocuments(),
        CourseModel.find()
          .skip(page - 1 * limit)
          .limit(limit)
          .populate('teacher')
      ])
      return {
        total,
        courses
      }
    } catch (error) {
      throw CustomError.internalServerError(`Error getting courses: ${error as string}`)
    }
  }
}
