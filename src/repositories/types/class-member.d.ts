import type { ClassMember, Prisma } from '@prisma'

type ClassMemberWithStudent = Prisma.ClassMemberGetPayload<{
  include: { student: true }
}>

type ClassMemberRepository = {
  create: (data: Prisma.ClassMemberCreateInput) => Promise<ClassMember>
  delete: (classId: string, studentId: string) => Promise<void>
  getUnique: (classId: string, studentId: string) => Promise<ClassMember | null>
  getByClassId: (
    classId: string,
    filter?: Prisma.ClassMemberFindManyArgs,
  ) => Promise<ClassMemberWithStudent[]>
}

export type { ClassMemberRepository, ClassMemberWithStudent }
