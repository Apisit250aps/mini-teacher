import type { ScoreStudentDetail } from './score-students'

type AssignType = 'ASSIGNMENT' | 'EXAM' | 'QUIZ'

interface ScoreAssign {
  id: string
  classId: string
  isEditable: boolean
  name: string
  description: string | null
  minScore: number
  maxScore: number
  type: AssignType
  assignDate: Date | string | null
  finalDate: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
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
  assignDate?: Date | string | null
  finalDate?: Date | string | null
}

interface UpdateScoreAssign {
  classId?: string
  isEditable?: boolean
  name?: string
  description?: string | null
  minScore?: number
  maxScore?: number
  type?: AssignType
  assignDate?: Date | string | null
  finalDate?: Date | string | null
}

export type {
  AssignType,
  ScoreAssign,
  ScoreAssignDetail,
  CreateScoreAssign,
  UpdateScoreAssign,
}
