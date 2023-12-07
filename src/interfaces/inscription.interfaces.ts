import type { ObjectId } from 'mongoose'

export interface Inscription {
  _id: ObjectId
  student: ObjectId
  program: ObjectId
  status: string
  enrollmentDate: Date
}

export interface CreateInscriptionProps {
  name: string
  lastName: string
  dateOfBirth: Date
  password: string
  rut: string
  program: ObjectId
  guardian: ObjectId
}
