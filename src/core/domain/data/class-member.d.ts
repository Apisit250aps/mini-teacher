import type { ClassMember } from '../entities/class-member'
import type { Student } from '../entities/student'
import type { FindManyOptions } from './common'

export type ClassMemberWithStudent = ClassMember & {
  student: Student
}

export interface ClassMemberCreateData {
  classId: string
  studentId: string
  userId?: string | null
}

export type ClassMemberQuery = FindManyOptions<
  Pick<
    ClassMember,
    'id' | 'classId' | 'studentId' | 'userId' | 'createdAt' | 'updatedAt'
  >
>
