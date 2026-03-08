import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { StudentRepository } from '@/core/domain/repositories/student'

const studentRepository: StudentRepository = {
  create: async (data) => {
    const result = await prisma.student.create({
      data: data as Prisma.StudentUncheckedCreateInput,
    })
    return result
  },
  update: async (id, data) => {
    const result = await prisma.student.update({
      where: { id },
      data: data as Prisma.StudentUncheckedUpdateInput,
    })
    return result
  },
  delete: async (id) => {
    await prisma.student.delete({ where: { id } })
  },
  getById: async (id) => {
    const result = await prisma.student.findUnique({
      where: { id },
      include: {
        classMembers: {
          include: {
            class: true,
          },
        },
        checkStudents: {
          include: {
            checkDate: true,
          },
        },
        scores: {
          include: {
            assignment: true,
          },
        },
      },
    })
    return result
  },
  getAllByTeacher: async (teacherId, filter = {}) => {
    const result = await prisma.student.findMany({
      ...(filter as unknown as Prisma.StudentFindManyArgs),
      where: {
        ...((filter.where ?? {}) as Prisma.StudentWhereInput),
        teacherId,
      },
      orderBy: (filter.orderBy as Prisma.StudentOrderByWithRelationInput) ?? {
        code: 'asc',
      },
    })
    return result
  },
  getUniqueByCode: async (teacherId, code) => {
    const result = await prisma.student.findFirst({
      where: {
        teacherId,
        code,
      },
    })
    return result
  },
}

export default studentRepository
