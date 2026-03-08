import type { CheckStudent } from '../entities/check-student'
import type { CheckStatus } from '../entities/enums'
import type { CheckDate } from '../entities/check-date'
import type { Student } from '../entities/student'
import type { FindManyOptions } from './common'

export type CheckStudentWithRelations = CheckStudent & {
  student: Student
  checkDate: CheckDate
}

export interface CheckStudentCreateData {
  checkDateId: string
  studentId: string
  status?: CheckStatus
}

export interface CheckStudentUpdateData {
  status?: CheckStatus
}

export type CheckStudentQuery = FindManyOptions<
  Pick<
    CheckStudent,
    'id' | 'checkDateId' | 'studentId' | 'status' | 'createdAt' | 'updatedAt'
  >
>
