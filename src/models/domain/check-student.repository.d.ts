import type { CheckStudent, CheckStudentDetail } from '@/models/domain/check-students'

interface CheckStudentRepository {
  createCheckStudent(data: CheckStudent): Promise<CheckStudent>
  updateCheckStudent(id: string, data: Partial<CheckStudent>): Promise<CheckStudent>
  deleteCheckStudent(id: string): Promise<void>
  getUniqueCheckStudent(checkDateId: string, studentId: string): Promise<CheckStudentDetail | null>
  getCheckStudentById(id: string): Promise<CheckStudentDetail | null>
}

export type { CheckStudentRepository }
