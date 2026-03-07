import type { CheckStudent, Prisma } from '@prisma'

type CheckStudentWithRelations = Prisma.CheckStudentGetPayload<{
  include: { student: true; checkDate: true }
}>

type CheckStudentRepository = {
  create: (data: Prisma.CheckStudentCreateInput) => Promise<CheckStudent>
  update: (
    id: string,
    data: Prisma.CheckStudentUpdateInput,
  ) => Promise<CheckStudent>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<CheckStudentWithRelations | null>
  getUnique: (
    checkDateId: string,
    studentId: string,
  ) => Promise<CheckStudentWithRelations | null>
  getByCheckDateId: (
    checkDateId: string,
    filter?: Prisma.CheckStudentFindManyArgs,
  ) => Promise<CheckStudentWithRelations[]>
}

export type { CheckStudentRepository, CheckStudentWithRelations }
