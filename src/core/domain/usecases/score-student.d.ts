import type {
  ScoreStudentCreateData,
  ScoreStudentQuery,
  ScoreStudentUpdateData,
} from '../data/score-student'
import type { ScoreStudentRepository } from '../repositories/score-student'

interface ScoreStudentUseCase {
  create: (
    data: ScoreStudentCreateData,
  ) => Promise<Awaited<ReturnType<ScoreStudentRepository['create']>>>
  update: (
    id: string,
    data: ScoreStudentUpdateData,
  ) => Promise<Awaited<ReturnType<ScoreStudentRepository['update']>>>
  delete: (id: string) => Promise<void>
  getUnique: (
    assignmentId: string,
    studentId: string,
  ) => Promise<Awaited<ReturnType<ScoreStudentRepository['getUnique']>>>
  getByAssignmentId: (
    assignmentId: string,
    filter?: ScoreStudentQuery,
  ) => Promise<Awaited<ReturnType<ScoreStudentRepository['getByAssignmentId']>>>
}

export type { ScoreStudentUseCase }
