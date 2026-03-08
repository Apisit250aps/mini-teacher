import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { ScoreAssignRepository } from '@/core/domain/repositories/score-assign'

const scoreAssignRepository: ScoreAssignRepository = {
  create: async (data) => {
    const result = await prisma.assignment.create({
      data: data as Prisma.AssignmentUncheckedCreateInput,
    })
    return result
  },
  update: async (id, data) => {
    const result = await prisma.assignment.update({
      where: { id },
      data: data as Prisma.AssignmentUncheckedUpdateInput,
    })
    return result
  },
  delete: async (id) => {
    await prisma.assignment.delete({ where: { id } })
  },
  getByClassId: async (classId, filter = {}) => {
    const result = await prisma.assignment.findMany({
      ...(filter as unknown as Prisma.AssignmentFindManyArgs),
      where: {
        ...((filter.where ?? {}) as Prisma.AssignmentWhereInput),
        classId,
      },
      orderBy:
        (filter.orderBy as Prisma.AssignmentOrderByWithRelationInput) ?? {
          createdAt: 'asc',
        },
      include: {
        scores: {
          include: {
            student: true,
          },
        },
      },
    })
    return result
  },
  getById: async (classId, assignId) => {
    const result = await prisma.assignment.findFirst({
      where: {
        classId,
        id: assignId,
      },
      include: {
        scores: {
          include: {
            student: true,
          },
        },
      },
    })
    return result
  },
  getUniqueByTitle: async (classId, title) => {
    const result = await prisma.assignment.findFirst({
      where: {
        classId,
        title,
      },
    })
    return result
  },
}

export default scoreAssignRepository
