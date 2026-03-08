import type { CheckDate } from '../entities/check-date'
import type { CheckStudent } from '../entities/check-student'
import type { Student } from '../entities/student'
import type { FindManyOptions } from './common'

export type CheckDateWithStudents = CheckDate & {
  checkStudents: Array<CheckStudent & { student: Student }>
}

export interface CheckDateCreateData {
  classId: string
  date: Date
  description?: string | null
  isEditable?: boolean
}

export interface CheckDateUpdateData {
  date?: Date
  description?: string | null
  isEditable?: boolean
}

export type CheckDateQuery = FindManyOptions<
  Pick<
    CheckDate,
    'id' | 'classId' | 'date' | 'isEditable' | 'createdAt' | 'updatedAt'
  >
>
