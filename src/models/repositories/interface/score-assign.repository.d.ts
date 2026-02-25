import type { ScoreAssign } from '@/models/domain/score-assigns'

interface ScoreAssignRepository {
  createScoreAssign(data: ScoreAssign): Promise<ScoreAssign>
  updateScoreAssign(assignId: string, data: Partial<ScoreAssign>): Promise<ScoreAssign | null>
  deleteScoreAssign(assignId: string): Promise<boolean>
  getScoreAssignsByClassId(classId: string): Promise<ScoreAssign[]>
  getScoreAssignById(classId: string, assignId: string): Promise<ScoreAssign | null>
}

export type { ScoreAssignRepository }
