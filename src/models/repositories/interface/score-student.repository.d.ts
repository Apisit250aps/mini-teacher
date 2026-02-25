import type { ScoreStudent } from '@/models/domain/score-students'

interface ScoreStudentRepository {
  createScoreStudent(data: ScoreStudent): Promise<ScoreStudent>
  updateScoreStudent(id: string, score: number): Promise<ScoreStudent>
  getUniqueScoreStudent(scoreAssignId: string, studentId: string): Promise<ScoreStudent | null>
  getScoreStudentsByAssignId(scoreAssignId: string): Promise<ScoreStudent[]>
}

export type { ScoreStudentRepository }
