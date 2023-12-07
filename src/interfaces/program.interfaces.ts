import type { ObjectId } from 'mongoose'

export interface Program {
  save: () => unknown
  name: string
  description: string
  courses: ObjectId[]
}

export interface CreateProgram {
  name: string
  description: string
}

export interface UpdateProgram {
  id: ObjectId
  name: string
  description: string
  courses: ObjectId[]
}
