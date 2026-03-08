import type { CheckStudent } from '../entities/check-student'
import type {
  CheckStudentCreateData,
  CheckStudentQuery,
  CheckStudentUpdateData,
  CheckStudentWithRelations,
} from '../data/check-student'

interface CheckStudentRepository {
  create: (data: CheckStudentCreateData) => Promise<CheckStudent>
  update: (id: string, data: CheckStudentUpdateData) => Promise<CheckStudent>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<CheckStudentWithRelations | null>
  getUnique: (
    checkDateId: string,
    studentId: string,
  ) => Promise<CheckStudentWithRelations | null>
  getByCheckDateId: (
    checkDateId: string,
    filter?: CheckStudentQuery,
  ) => Promise<CheckStudentWithRelations[]>
}

export type { CheckStudentRepository, CheckStudentWithRelations }
