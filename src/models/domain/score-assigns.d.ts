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
  assignDate: Date
  finalDate: Date
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
  assignDate?: Date
  finalDate?: Date
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
