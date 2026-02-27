import { Year } from '@prisma'

type YearRepository = {
  getAll: (filter: Prisma.YearFindManyArgs) => Promise<Year[]>
  getById: (id: string) => Promise<Year | null>
  getUnique: (
    userId: string,
    year: number,
    term: number,
  ) => Promise<Year | null>
  create: (year: YearCreateInput) => Promise<Year>
  update: (id: string, year: YearUpdateInput) => Promise<Year>
  delete: (id: string) => Promise<void>
}

export type { YearRepository }
