import type { Class } from '../entities/class'
import type { Assignment } from '../entities/assignment'
import type { CheckDate } from '../entities/check-date'
import type { ClassMember } from '../entities/class-member'
import type { Student } from '../entities/student'
import type { Year } from '../entities/year'
import type { FindManyOptions } from './common'

export type ClassWithMembers = Class & {
  classMembers: Array<ClassMember & { student: Student }>
}

export type ClassWithDetails = Class & {
  year: Year
  classMembers: Array<ClassMember & { student: Student }>
  checkDates: CheckDate[]
  assignments: Assignment[]
}

export interface ClassCreateData {
  yearId: string
  name: string
  subject: string
  description?: string | null
  isActive?: boolean
}

export interface ClassUpdateData {
  yearId?: string
  name?: string
  subject?: string
  description?: string | null
  isActive?: boolean
}

export type ClassQuery = FindManyOptions<
  Pick<
    Class,
    | 'id'
    | 'yearId'
    | 'name'
    | 'subject'
    | 'isActive'
    | 'createdAt'
    | 'updatedAt'
  >
>
