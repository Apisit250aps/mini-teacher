import type { Score } from '../entities/score'
import type { Student } from '../entities/student'
import type { FindManyOptions } from './common'

export type ScoreWithStudent = Score & {
  student: Student
}

export interface ScoreStudentCreateData {
  assignmentId: string
  studentId: string
  score: number
}

export interface ScoreStudentUpdateData {
  score: number
}

export type ScoreStudentQuery = FindManyOptions<
  Pick<
    Score,
    'id' | 'assignmentId' | 'studentId' | 'score' | 'createdAt' | 'updatedAt'
  >
>
