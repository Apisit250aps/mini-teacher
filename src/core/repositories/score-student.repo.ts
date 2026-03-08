import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { ScoreStudentRepository } from '@/core/domain/repositories/score-student'

const scoreStudentRepository: ScoreStudentRepository = {
  create: async (data) => {
    const result = await prisma.score.create({
      data: data as Prisma.ScoreUncheckedCreateInput,
    })
    return result
  },
  update: async (id, data) => {
    const result = await prisma.score.update({
      where: { id },
      data: data as Prisma.ScoreUncheckedUpdateInput,
    })
    return result
  },
  delete: async (id) => {
    await prisma.score.delete({ where: { id } })
  },
  getUnique: async (assignmentId, studentId) => {
    const result = await prisma.score.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId,
        },
      },
    })
    return result
  },
  getByAssignmentId: async (assignmentId, filter = {}) => {
    const result = await prisma.score.findMany({
      ...(filter as unknown as Prisma.ScoreFindManyArgs),
      where: {
        ...((filter.where ?? {}) as Prisma.ScoreWhereInput),
        assignmentId,
      },
      orderBy: (filter.orderBy as Prisma.ScoreOrderByWithRelationInput) ?? {
        createdAt: 'asc',
      },
      include: {
        student: true,
      },
    })
    return result
  },
}

export default scoreStudentRepository
