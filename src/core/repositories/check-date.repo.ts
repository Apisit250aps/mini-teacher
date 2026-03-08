import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { CheckDateRepository } from '@/core/domain/repositories/check-date'

const checkDateRepository: CheckDateRepository = {
  create: async (data) => {
    const result = await prisma.checkDate.create({
      data: data as Prisma.CheckDateUncheckedCreateInput,
    })
    return result
  },
  update: async (id, data) => {
    const result = await prisma.checkDate.update({
      where: { id },
      data: data as Prisma.CheckDateUncheckedUpdateInput,
    })
    return result
  },
  delete: async (id) => {
    await prisma.checkDate.delete({ where: { id } })
  },
  getById: async (id) => {
    const result = await prisma.checkDate.findUnique({
      where: { id },
      include: {
        checkStudents: {
          include: {
            student: true,
          },
        },
      },
    })
    return result
  },
  getByClassId: async (classId, filter = {}) => {
    const result = await prisma.checkDate.findMany({
      ...(filter as unknown as Prisma.CheckDateFindManyArgs),
      where: {
        ...((filter.where ?? {}) as Prisma.CheckDateWhereInput),
        classId,
      },
      orderBy: (filter.orderBy as Prisma.CheckDateOrderByWithRelationInput) ?? {
        date: 'asc',
      },
      include: {
        checkStudents: {
          include: {
            student: true,
          },
        },
      },
    })
    return result
  },
  getUniqueByDate: async (classId, date) => {
    const result = await prisma.checkDate.findFirst({
      where: {
        classId,
        date,
      },
    })
    return result
  },
}

export default checkDateRepository
