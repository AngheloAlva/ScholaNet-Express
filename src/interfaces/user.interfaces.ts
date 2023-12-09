import { type ObjectId } from 'mongoose'

export interface User {
  save: () => unknown
  _id: ObjectId
  name: string
  lastName: string
  rut: string
  email: string
  password: string
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
  password: string
}

export interface UpdateUser {
  id: ObjectId
  name?: string
  lastName?: string
  email?: string
}

export interface LoginUser {
  email: string
  password: string
}
