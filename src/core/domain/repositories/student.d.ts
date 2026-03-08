import type { Student } from '../entities/student'
import type {
  StudentCreateData,
  StudentQuery,
  StudentUpdateData,
  StudentWithRelations,
} from '../data/student'

interface StudentRepository {
  create: (data: StudentCreateData) => Promise<Student>
  update: (id: string, data: StudentUpdateData) => Promise<Student>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<StudentWithRelations | null>
  getAllByTeacher: (
    teacherId: string,
    filter?: StudentQuery,
  ) => Promise<Student[]>
  getUniqueByCode: (teacherId: string, code: string) => Promise<Student | null>
}

export type { StudentRepository, StudentWithRelations }
