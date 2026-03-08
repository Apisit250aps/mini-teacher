import type {
  CheckDateCreateData,
  CheckDateQuery,
  CheckDateUpdateData,
} from '../data/check-date'
import type { CheckDateRepository } from '../repositories/check-date'

interface CheckDateUseCase {
  create: (
    data: CheckDateCreateData,
  ) => Promise<Awaited<ReturnType<CheckDateRepository['create']>>>
  update: (
    id: string,
    data: CheckDateUpdateData,
  ) => Promise<Awaited<ReturnType<CheckDateRepository['update']>>>
  delete: (id: string) => Promise<void>
  getById: (
    id: string,
  ) => Promise<Awaited<ReturnType<CheckDateRepository['getById']>>>
  getByClassId: (
    classId: string,
    filter?: CheckDateQuery,
  ) => Promise<Awaited<ReturnType<CheckDateRepository['getByClassId']>>>
}

export type { CheckDateUseCase }
