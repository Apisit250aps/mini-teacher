import type { CheckStudent, CheckStudentDetail } from '@/models/domain/check-students'

interface CheckStudentRepository {
  create(data: CheckStudent): Promise<CheckStudent>
  update(id: string, data: Partial<CheckStudent>): Promise<CheckStudent>
  delete(id: string): Promise<void>
  getUnique(checkDateId: string, studentId: string): Promise<CheckStudentDetail | null>
  getById(id: string): Promise<CheckStudentDetail | null>
}

export type { CheckStudentRepository }
