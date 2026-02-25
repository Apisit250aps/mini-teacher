import type { ScoreAssign } from '@/models/domain/score-assigns'

interface ScoreAssignRepository {
  create(data: ScoreAssign): Promise<ScoreAssign>
  update(
    id: string,
    data: Partial<ScoreAssign>,
  ): Promise<ScoreAssign | null>
  delete(id: string): Promise<boolean>
  getById(id: string): Promise<ScoreAssign | null>
  getByClassId(classId: string): Promise<ScoreAssign[]>
}

export type { ScoreAssignRepository }
