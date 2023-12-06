import { type ObjectId } from 'mongoose'
import { AssignmentModel } from '../data/models/assignment'
import { CustomError } from '../domain/errors/custom.error'

interface Assignment {
  deleteOne: () => unknown
  save: () => unknown
  title: string
  description: string
  dueDate: Date
  type: 'task' | 'evaluation'
  course: ObjectId
  submissions: Array<{
    student: ObjectId
    fileUrl: string
    feedback: string
  }>
  score: number
}

export async function verifyAssignmentExists (assignmentId: ObjectId): Promise<Assignment> {
  const assignment = await AssignmentModel.findById(assignmentId)
  if (assignment == null) throw CustomError.notFound('Assignment not found')

  return assignment as unknown as Assignment
}
