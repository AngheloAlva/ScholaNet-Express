import { type ObjectId } from 'mongoose'

export interface Course {
  save: () => unknown
  title: string
  description: string
  program: ObjectId
  image: string
  href: string
  section: string
}

export interface CreateCourse {
  title: string
  description: string
  program: ObjectId
  image: string
  href: string
  section: string
}

export interface UpdateCourse {
  id: ObjectId
  title: string
  description: string
  image: string
  href: string
}
