import { ProgramModel } from '../data/models/program'
import { CustomError } from '../domain/errors/custom.error'
import { type Program } from '../interfaces/program.interfaces'
import { type ObjectId } from 'mongoose'

export async function verifyProgramExists (programId: ObjectId): Promise<Program> {
  const programExist = await ProgramModel.findById(programId)
  if (programExist == null) throw CustomError.badRequest('Program does not exist')

  return programExist as unknown as Program
}
