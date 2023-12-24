import type { ObjectId } from 'mongoose'

export interface CourseInstance {
  course: ObjectId
  teacher: ObjectId
  students: ObjectId[]
  semester: ObjectId
  academicYear: string
  classroom: string
  schedule: Array<{
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'
    startTime: string
    endTime: string
    duration: number
  }>
}

export interface CreateCourseInstance {
  course: ObjectId
  teacher: ObjectId
  semester: ObjectId
  academicYear: string
  classroom: string
  schedule: Array<{
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'
    startTime: string
    endTime: string
    duration: number
  }>
}

export interface UpdateCourseInstance {
  id: ObjectId
  teacher?: ObjectId
  classroom?: string
  schedule?: Array<{
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'
    startTime: string
    endTime: string
    duration: number
  }>
}
