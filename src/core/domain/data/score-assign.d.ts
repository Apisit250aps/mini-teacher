import type { Assignment } from '../entities/assignment'
import type { AssignType } from '../entities/enums'
import type { Score } from '../entities/score'
import type { Student } from '../entities/student'
import type { FindManyOptions } from './common'

export type ScoreAssignWithScores = Assignment & {
  scores: Array<Score & { student: Student }>
}

export interface ScoreAssignCreateData {
  classId: string
  title: string
  description?: string | null
  minScore?: number
  maxScore?: number
  type?: AssignType
  assignDate?: Date | null
  dueDate?: Date | null
  isEditable?: boolean
}

export interface ScoreAssignUpdateData {
  title?: string
  description?: string | null
  minScore?: number
  maxScore?: number
  type?: AssignType
  assignDate?: Date | null
  dueDate?: Date | null
  isEditable?: boolean
}

export type ScoreAssignQuery = FindManyOptions<
  Pick<
    Assignment,
    | 'id'
    | 'classId'
    | 'title'
    | 'type'
    | 'assignDate'
    | 'dueDate'
    | 'isEditable'
    | 'createdAt'
    | 'updatedAt'
  >
>
