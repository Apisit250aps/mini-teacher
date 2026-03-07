import type { CheckDate, Prisma } from '@prisma'

type CheckDateWithStudents = Prisma.CheckDateGetPayload<{
  include: { checkStudents: { include: { student: true } } }
}>

type CheckDateRepository = {
  create: (data: Prisma.CheckDateCreateInput) => Promise<CheckDate>
  update: (id: string, data: Prisma.CheckDateUpdateInput) => Promise<CheckDate>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<CheckDateWithStudents | null>
  getByClassId: (
    classId: string,
    filter?: Prisma.CheckDateFindManyArgs,
  ) => Promise<CheckDateWithStudents[]>
  getUniqueByDate: (classId: string, date: Date) => Promise<CheckDate | null>
}

export type { CheckDateRepository, CheckDateWithStudents }
