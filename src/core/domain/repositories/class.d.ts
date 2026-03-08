import type { Class } from '../entities/class'
import type {
  ClassCreateData,
  ClassQuery,
  ClassUpdateData,
  ClassWithDetails,
  ClassWithMembers,
} from '../data/class'

interface ClassRepository {
  create: (data: ClassCreateData) => Promise<Class>
  update: (id: string, data: ClassUpdateData) => Promise<Class>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<ClassWithDetails | null>
  getByYearId: (
    yearId: string,
    filter?: ClassQuery,
  ) => Promise<ClassWithMembers[]>
  getByYearAndClassId: (
    yearId: string,
    classId: string,
  ) => Promise<ClassWithDetails | null>
  getUniqueByName: (yearId: string, name: string) => Promise<Class | null>
}

export type { ClassRepository, ClassWithMembers, ClassWithDetails }
