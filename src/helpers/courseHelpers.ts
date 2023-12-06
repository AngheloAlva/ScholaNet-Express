import { type ObjectId } from 'mongoose'
import { CourseModel } from '../data/models/course'
import { CustomError } from '../domain/errors/custom.error'
import { type Course } from '../interfaces/course.interfaces'

export async function verifyCourseExists (courseId: ObjectId): Promise<Course> {
  const course = await CourseModel.findById(courseId)
  if (course == null) throw CustomError.notFound('Course not found')

  return course as unknown as Course
}
