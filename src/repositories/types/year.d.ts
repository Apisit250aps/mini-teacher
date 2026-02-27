import { Prisma } from '@db'

type YearRepo = {
  create: (year: Prisma.YearCreateInput) => Promise<Prisma.YearModel>
  getAll: (filter: Prisma.YearFindManyArgs) => Promise<Prisma.Year[]>
  getById: (id: string) => Promise<Prisma.YearModel | null>
  update: (
    id: string,
    year: Prisma.YearUpdateInput,
  ) => Promise<Prisma.YearModel>
  delete: (id: string) => Promise<void>
}

export type { YearRepo }
