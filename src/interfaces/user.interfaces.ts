import { type ObjectId } from 'mongoose'

export interface User {
  save: () => unknown
  name: string
  lastName: string
  rut: string
  email: string
  role: 'guardian' | 'teacher' | 'admin'
  state: 'active' | 'inactive'
  students: Array<{
    name: string
    lastName: string
    dateOfBirth: Date
    rut: string
    password: string
    program: ObjectId
  }>
}

export interface CreateUser {
  name: string
  lastName: string
  rut: string
  email: string
  role: string
}

export interface UpdateUser {
  id: ObjectId
  name?: string
  lastName?: string
  email?: string
}
