import type {
  ClassCreateData,
  ClassQuery,
  ClassUpdateData,
} from '../data/class'
import type { ClassRepository } from '../repositories/class'

interface ClassUseCase {
  create: (
    data: ClassCreateData,
  ) => Promise<Awaited<ReturnType<ClassRepository['create']>>>
  update: (
    id: string,
    data: ClassUpdateData,
  ) => Promise<Awaited<ReturnType<ClassRepository['update']>>>
  delete: (id: string) => Promise<void>
  getById: (
    id: string,
  ) => Promise<Awaited<ReturnType<ClassRepository['getById']>>>
  getByYearId: (
    yearId: string,
    filter?: ClassQuery,
  ) => Promise<Awaited<ReturnType<ClassRepository['getByYearId']>>>
  getByYearAndClassId: (
    yearId: string,
    classId: string,
  ) => Promise<Awaited<ReturnType<ClassRepository['getByYearAndClassId']>>>
}

export type { ClassUseCase }
