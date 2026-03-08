import type { Score } from '../entities/score'
import type {
  ScoreStudentCreateData,
  ScoreStudentQuery,
  ScoreStudentUpdateData,
  ScoreWithStudent,
} from '../data/score-student'

interface ScoreStudentRepository {
  create: (data: ScoreStudentCreateData) => Promise<Score>
  update: (id: string, data: ScoreStudentUpdateData) => Promise<Score>
  delete: (id: string) => Promise<void>
  getUnique: (assignmentId: string, studentId: string) => Promise<Score | null>
  getByAssignmentId: (
    assignmentId: string,
    filter?: ScoreStudentQuery,
  ) => Promise<ScoreWithStudent[]>
}

export type { ScoreStudentRepository, ScoreWithStudent }
