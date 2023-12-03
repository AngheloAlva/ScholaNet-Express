import { CourseModel } from '../../data/models/course'
import { ProgramModel } from '../../data/models/program'
import { UserModel } from '../../data/models/user'
import { CustomError } from '../../domain/errors/custom.error'
import { type PaginationDto } from '../../domain/shared/pagination.dto'

interface CreateCourse {
  title: string
  description: string
  program: string
  teacher: string
  image: string
  href: string
}

export class CourseService {
  async createCourse ({
    title, description, program, teacher, image, href
  }: CreateCourse): Promise<any> {
    const courseExist = await CourseModel.findOne({ title })
    if (courseExist != null) throw CustomError.badRequest('Course already exists')

    const teacherExist = await UserModel.findById(teacher).where({ role: 'teacher' })
    if (teacherExist == null) throw CustomError.badRequest('Teacher does not exist')

    const programExist = await ProgramModel.findById(program)
    if (programExist == null) throw CustomError.badRequest('Program does not exist')

    try {
      const course = new CourseModel({ title, description, program, teacher, image, href })
      await course.save()

      await ProgramModel.findByIdAndUpdate(program, {
        $push: { courses: course.id }
      })

      return course
    } catch (error) {
      throw CustomError.internalServerError(`Error creating course: ${error as string}`)
    }
  }

  async getCourses ({ page, limit }: PaginationDto): Promise<any> {
    try {
      const [total, courses] = await Promise.all([
        CourseModel.countDocuments(),
        CourseModel.find()
          .skip((page - 1) * limit)
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

  async getCourseById (id: string): Promise<any> {
    try {
      const course = await CourseModel.findById(id).populate('teacher')
      if (course == null) throw CustomError.notFound('Course not found')

      return course
    } catch (error) {
      throw CustomError.internalServerError(`Error getting course: ${error as string}`)
    }
  }
}
