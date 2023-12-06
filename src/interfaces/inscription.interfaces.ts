import type { ObjectId } from 'mongoose'

export interface CreateInscriptionProps {
  name: string
  lastName: string
  dateOfBirth: Date
  password: string
  rut: string
  program: ObjectId
  guardian: ObjectId
}
