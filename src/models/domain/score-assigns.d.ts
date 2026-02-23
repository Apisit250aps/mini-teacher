import type { ScoreStudentDetail } from './score-students'

type AssignType = 'ASSIGNMENT' | 'EXAM' | 'QUIZ'

interface ScoreAssign {
  id: string
  classId: string
  isEditable: boolean
  name: string
  description?: string | null
  minScore: number
  maxScore: number
  type: AssignType
  assignDate: Date | null
  finalDate: Date | null
  createdAt: Date
  updatedAt: Date
}

interface ScoreAssignDetail extends ScoreAssign {
  scores: ScoreStudentDetail[]
}

interface CreateScoreAssign {
  classId: string
  isEditable?: boolean
  name: string
  description?: string | null
  minScore?: number
  maxScore?: number
  type?: AssignType
  assignDate?: Date | null
  finalDate?: Date | null
}

interface UpdateScoreAssign extends Partial<CreateScoreAssign> {
  id: string
}

export type {
  AssignType,
  ScoreAssign,
  ScoreAssignDetail,
  CreateScoreAssign,
  UpdateScoreAssign,
}
