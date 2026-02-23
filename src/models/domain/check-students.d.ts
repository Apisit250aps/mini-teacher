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

interface CreateCheckStudent {
  checkDateId: string
  studentId: string
  status?: CheckStatus
}

interface UpdateCheckStudent extends Partial<CreateCheckStudent> {
  id: string
}

export type {
  CheckStatus,
  CheckStudent,
  CheckStudentDetail,
  CreateCheckStudent,
  UpdateCheckStudent,
}
