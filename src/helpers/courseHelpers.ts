import { type ObjectId } from 'mongoose'
import { CourseModel } from '../data/models/course'
import { CustomError } from '../domain/errors/custom.error'

interface Course {
  save: () => unknown
  title: string
  description: string
  program: ObjectId
  students: ObjectId[]
  teacher: ObjectId
  image: string
  href: string
}

export async function verifyCourseExists (courseId: ObjectId): Promise<Course> {
  const course = await CourseModel.findById(courseId)
  if (course == null) throw CustomError.notFound('Course not found')

  return course as unknown as Course
}
