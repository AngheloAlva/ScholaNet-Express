import type { ObjectId } from 'mongoose'

export interface Student {
  name: string
  lastName: string
  dateOfBirth: Date
  password: string
  guardian: ObjectId
  rut: string
  program: ObjectId
  state: 'active' | 'inactive'
}

export interface CreateStudent {
  name: string
  lastName: string
  dateOfBirth: Date
  password: string
  rut: string
  program: ObjectId
  guardian: ObjectId
}

export interface UpdateStudent {
  id: ObjectId
  password?: string
  program?: ObjectId
  guardian?: ObjectId
}
