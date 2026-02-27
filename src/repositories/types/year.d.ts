import { Prisma } from '@db'

interface YearRepository {
  create: (year: Prisma.YearCreateInput) => Promise<Prisma.YearModel>
  findAll: () => Promise<Prisma.YearCreateWithoutClassesInput[]>
  findById: (id: string) => Promise<Prisma.YearModel | null>
  update: (
    id: string,
    year: Prisma.YearUpdateInput,
  ) => Promise<Prisma.YearModel>
  delete: (id: string) => Promise<void>
}

export type { YearRepository }
