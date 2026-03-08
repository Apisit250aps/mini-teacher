import type { Student } from '../entities/student'
import type { Assignment } from '../entities/assignment'
import type { CheckDate } from '../entities/check-date'
import type { CheckStudent } from '../entities/check-student'
import type { Class } from '../entities/class'
import type { ClassMember } from '../entities/class-member'
import type { Score } from '../entities/score'
import type { FindManyOptions } from './common'

export type StudentWithRelations = Student & {
  classMembers: Array<ClassMember & { class: Class }>
  checkStudents: Array<CheckStudent & { checkDate: CheckDate }>
  scores: Array<Score & { assignment: Assignment }>
}

export interface StudentCreateData {
  teacherId: string
  code: string
  prefix?: string | null
  firstName: string
  lastName: string
  nickname?: string | null
}

export interface StudentUpdateData {
  code?: string
  prefix?: string | null
  firstName?: string
  lastName?: string
  nickname?: string | null
}

export type StudentQuery = FindManyOptions<
  Pick<
    Student,
    | 'id'
    | 'teacherId'
    | 'code'
    | 'firstName'
    | 'lastName'
    | 'createdAt'
    | 'updatedAt'
  >
>
