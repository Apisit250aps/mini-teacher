import type { Prisma, Student } from '@prisma'

type StudentWithRelations = Prisma.StudentGetPayload<{
  include: {
    classMembers: { include: { class: true } }
    checkStudents: { include: { checkDate: true } }
    scores: { include: { assignment: true } }
  }
}>

type StudentRepository = {
  create: (data: Prisma.StudentCreateInput) => Promise<Student>
  update: (id: string, data: Prisma.StudentUpdateInput) => Promise<Student>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<StudentWithRelations | null>
  getAllByTeacher: (
    teacherId: string,
    filter?: Prisma.StudentFindManyArgs,
  ) => Promise<Student[]>
  getUniqueByCode: (teacherId: string, code: string) => Promise<Student | null>
}

export type { StudentRepository, StudentWithRelations }
