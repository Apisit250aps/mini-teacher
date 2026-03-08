import type { Prisma, Year } from '@prisma'

type YearWithClasses = Prisma.YearGetPayload<{
  include: { classes: true }
}>

type YearWithOwnerAndClasses = Prisma.YearGetPayload<{
  include: { classes: true; owner: true }
}>

type YearRepository = {
  getAll: (filter?: Prisma.YearFindManyArgs) => Promise<YearWithClasses[]>
  getById: (id: string) => Promise<YearWithOwnerAndClasses | null>
  getUnique: (
    userId: string,
    year: number,
    term: number,
  ) => Promise<Year | null>
  create: (data: Prisma.YearCreateInput) => Promise<Year>
  update: (id: string, data: Prisma.YearUpdateInput) => Promise<Year>
  delete: (id: string) => Promise<void>
  setActive: (userId: string, yearId: string) => Promise<void>
  getActiveByUser: (userId: string) => Promise<Year | null>
}

export type { YearRepository, YearWithClasses, YearWithOwnerAndClasses }
