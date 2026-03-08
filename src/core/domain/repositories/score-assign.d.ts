import type { Assignment } from '../entities/assignment'
import type {
  ScoreAssignCreateData,
  ScoreAssignQuery,
  ScoreAssignUpdateData,
  ScoreAssignWithScores,
} from '../data/score-assign'

interface ScoreAssignRepository {
  create: (data: ScoreAssignCreateData) => Promise<Assignment>
  update: (id: string, data: ScoreAssignUpdateData) => Promise<Assignment>
  delete: (id: string) => Promise<void>
  getByClassId: (
    classId: string,
    filter?: ScoreAssignQuery,
  ) => Promise<ScoreAssignWithScores[]>
  getById: (
    classId: string,
    assignId: string,
  ) => Promise<ScoreAssignWithScores | null>
  getUniqueByTitle: (
    classId: string,
    title: string,
  ) => Promise<Assignment | null>
}

export type { ScoreAssignRepository, ScoreAssignWithScores }
