import type {
  CheckStudentCreateData,
  CheckStudentQuery,
  CheckStudentUpdateData,
} from '../data/check-student'
import type { CheckStudentRepository } from '../repositories/check-student'

interface CheckStudentUseCase {
  create: (
    data: CheckStudentCreateData,
  ) => Promise<Awaited<ReturnType<CheckStudentRepository['create']>>>
  update: (
    id: string,
    data: CheckStudentUpdateData,
  ) => Promise<Awaited<ReturnType<CheckStudentRepository['update']>>>
  delete: (id: string) => Promise<void>
  getById: (
    id: string,
  ) => Promise<Awaited<ReturnType<CheckStudentRepository['getById']>>>
  getUnique: (
    checkDateId: string,
    studentId: string,
  ) => Promise<Awaited<ReturnType<CheckStudentRepository['getUnique']>>>
  getByCheckDateId: (
    checkDateId: string,
    filter?: CheckStudentQuery,
  ) => Promise<Awaited<ReturnType<CheckStudentRepository['getByCheckDateId']>>>
}

export type { CheckStudentUseCase }
