import { prisma } from '@/lib/prisma'
import type { CheckDateRepository } from '@/core/domain/check-date'

const checkDateRepository: CheckDateRepository = {
  create: async (data) => {
    const result = await prisma.checkDate.create({ data })
    return result
  },
  update: async (id, data) => {
    const result = await prisma.checkDate.update({
      where: { id },
      data,
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
      ...filter,
      where: {
        ...(filter.where ?? {}),
        classId,
      },
      orderBy: filter.orderBy ?? { date: 'asc' },
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
