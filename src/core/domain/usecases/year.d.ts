import type { YearCreateData, YearQuery, YearUpdateData } from '../data/year'
import type { YearRepository } from '../repositories/year'

interface YearUseCase {
  create: (
    data: YearCreateData,
  ) => Promise<Awaited<ReturnType<YearRepository['create']>>>
  update: (
    id: string,
    data: YearUpdateData,
  ) => Promise<Awaited<ReturnType<YearRepository['update']>>>
  delete: (id: string) => Promise<void>
  getAll: (
    filter?: YearQuery,
  ) => Promise<Awaited<ReturnType<YearRepository['getAll']>>>
  getById: (
    id: string,
  ) => Promise<Awaited<ReturnType<YearRepository['getById']>>>
  getUnique: (
    userId: string,
    year: number,
    term: number,
  ) => Promise<Awaited<ReturnType<YearRepository['getUnique']>>>
  setActive: (userId: string, yearId: string) => Promise<void>
  getActiveByUser: (
    userId: string,
  ) => Promise<Awaited<ReturnType<YearRepository['getActiveByUser']>>>
}

export type { YearUseCase }
