import type { Student } from './students'

interface ScoreStudent {
  id: string
  scoreAssignId: string
  studentId: string
  score: number
  createdAt: Date | string
  updatedAt: Date | string
}

interface ScoreStudentDetail extends ScoreStudent {
  student: Student
}

interface CreateScoreStudent {
  scoreAssignId: string
  studentId: string
  score?: number
}

interface UpdateScoreStudent extends Partial<CreateScoreStudent> {
  id: string
}

export type {
  ScoreStudent,
  ScoreStudentDetail,
  CreateScoreStudent,
  UpdateScoreStudent,
}
