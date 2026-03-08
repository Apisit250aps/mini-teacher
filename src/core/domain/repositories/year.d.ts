import type { Year } from '../entities/year'
import type {
  YearCreateData,
  YearQuery,
  YearUpdateData,
  YearWithClasses,
  YearWithOwnerAndClasses,
} from '../data/year'

interface YearRepository {
  getAll: (filter?: YearQuery) => Promise<YearWithClasses[]>
  getById: (id: string) => Promise<YearWithOwnerAndClasses | null>
  getUnique: (
    userId: string,
    year: number,
    term: number,
  ) => Promise<Year | null>
  create: (data: YearCreateData) => Promise<Year>
  update: (id: string, data: YearUpdateData) => Promise<Year>
  delete: (id: string) => Promise<void>
  setActive: (userId: string, yearId: string) => Promise<void>
  getActiveByUser: (userId: string) => Promise<Year | null>
}

export type { YearRepository, YearWithClasses, YearWithOwnerAndClasses }
