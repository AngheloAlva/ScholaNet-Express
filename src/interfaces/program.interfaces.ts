import { type Course } from './course.interfaces'

export interface Program {
  name: string
  description: string
  courses: Course[]
}

export interface CreateProgram {
  name: string
  description: string
}
