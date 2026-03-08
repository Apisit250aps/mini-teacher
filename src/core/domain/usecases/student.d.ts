import type {
  StudentCreateData,
  StudentQuery,
  StudentUpdateData,
} from '../data/student'
import type { StudentRepository } from '../repositories/student'

interface StudentUseCase {
  create: (
    data: StudentCreateData,
  ) => Promise<Awaited<ReturnType<StudentRepository['create']>>>
  update: (
    id: string,
    data: StudentUpdateData,
  ) => Promise<Awaited<ReturnType<StudentRepository['update']>>>
  delete: (id: string) => Promise<void>
  getById: (
    id: string,
  ) => Promise<Awaited<ReturnType<StudentRepository['getById']>>>
  getAllByTeacher: (
    teacherId: string,
    filter?: StudentQuery,
  ) => Promise<Awaited<ReturnType<StudentRepository['getAllByTeacher']>>>
}

export type { StudentUseCase }
