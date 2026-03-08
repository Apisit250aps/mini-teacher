import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { CheckDateRepository } from '@/core/domain/repositories/check-date'

const ensureClassExists = async (classId: string): Promise<void> => {
  const existing = await prisma.class.findUnique({ where: { id: classId } })
  if (!existing) {
    throw new Error(`Class not found for classId: ${classId}`)
  }
}

const checkDateRepository: CheckDateRepository = {
  create: async (data) => {
    await ensureClassExists(data.classId)

    const result = await prisma.checkDate.create({
      data: {
        classId: data.classId,
        date: data.date,
        description: data.description,
        isEditable: data.isEditable,
      },
    })
    return result
  },
  update: async (id, data) => {
    const result = await prisma.checkDate.update({
      where: { id },
      data: {
        date: data.date,
        description: data.description,
        isEditable: data.isEditable,
      },
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
