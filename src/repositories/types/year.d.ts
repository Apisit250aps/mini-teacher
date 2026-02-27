import { Prisma } from '@prisma'

type YearRepository = {
  getAll: (filter: Prisma.YearFindManyArgs) => Promise<Prisma.Year[]>
  getById: (id: string) => Promise<Prisma.Year | null>
  getUnique: (
    userId: string,
    year: number,
    term: number,
  ) => Promise<Prisma.Year | null>
  create: (year: Prisma.YearCreateInput) => Promise<Prisma.Year>
  update: (id: string, year: Prisma.YearUpdateInput) => Promise<Prisma.Year>
  delete: (id: string) => Promise<void>
}

export type { YearRepository }
