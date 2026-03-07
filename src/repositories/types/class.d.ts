import type { Class, Prisma } from '@prisma'

type ClassWithMembers = Prisma.ClassGetPayload<{
  include: { classMembers: { include: { student: true } } }
}>

type ClassWithDetails = Prisma.ClassGetPayload<{
  include: {
    year: true
    classMembers: { include: { student: true } }
    checkDates: true
    assignments: true
  }
}>

type ClassRepository = {
  create: (data: Prisma.ClassCreateInput) => Promise<Class>
  update: (id: string, data: Prisma.ClassUpdateInput) => Promise<Class>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<ClassWithDetails | null>
  getByYearId: (
    yearId: string,
    filter?: Prisma.ClassFindManyArgs,
  ) => Promise<ClassWithMembers[]>
  getByYearAndClassId: (
    yearId: string,
    classId: string,
  ) => Promise<ClassWithDetails | null>
  getUniqueByName: (yearId: string, name: string) => Promise<Class | null>
}

export type { ClassRepository, ClassWithMembers, ClassWithDetails }
