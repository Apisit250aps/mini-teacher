import type {
  ScoreAssignCreateData,
  ScoreAssignQuery,
  ScoreAssignUpdateData,
} from '../data/score-assign'
import type { ScoreAssignRepository } from '../repositories/score-assign'

interface ScoreAssignUseCase {
  create: (
    data: ScoreAssignCreateData,
  ) => Promise<Awaited<ReturnType<ScoreAssignRepository['create']>>>
  update: (
    id: string,
    data: ScoreAssignUpdateData,
  ) => Promise<Awaited<ReturnType<ScoreAssignRepository['update']>>>
  delete: (id: string) => Promise<void>
  getByClassId: (
    classId: string,
    filter?: ScoreAssignQuery,
  ) => Promise<Awaited<ReturnType<ScoreAssignRepository['getByClassId']>>>
  getById: (
    classId: string,
    assignId: string,
  ) => Promise<Awaited<ReturnType<ScoreAssignRepository['getById']>>>
}

export type { ScoreAssignUseCase }
