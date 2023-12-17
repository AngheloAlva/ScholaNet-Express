import type { ObjectId } from 'mongoose'

export interface CreateMaterial {
  title: string
  description: string
  type: 'pdf' | 'link' | 'file'
  url: string
  courseInstance: ObjectId
}

export interface UpdateMaterial {
  id: ObjectId
  title: string
  description: string
  type: 'pdf' | 'link' | 'file'
  url: string
}
