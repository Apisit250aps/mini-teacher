import type { Student } from './students'

type CheckStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE' | null

interface CheckStudent {
  id: string
  checkDateId: string
  studentId: string
  status: CheckStatus
  createdAt: Date
  updatedAt: Date
}

interface CheckStudentDetail extends CheckStudent {
  student: Student
}

interface CheckStudentCreate {
  checkDateId: string
  studentId: string
  status?: CheckStatus
}

interface CheckStudentUpdate extends Partial<CheckStudentCreate> {
  id: string
}

export type {
  CheckStatus,
  CheckStudent,
  CheckStudentDetail,
  CheckStudentCreate,
  CheckStudentUpdate,
}
