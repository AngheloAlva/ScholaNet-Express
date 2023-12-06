import { type ObjectId } from 'mongoose'

export interface Course {
  save: () => unknown
  title: string
  description: string
  program: ObjectId
  students: ObjectId[]
  teacher: ObjectId
  image: string
  href: string
}

export interface CreateCourse {
  id?: ObjectId
  title: string
  description: string
  program: ObjectId
  teacher: ObjectId
  image: string
  href: string
}
