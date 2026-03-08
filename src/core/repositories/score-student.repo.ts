import { prisma } from '@/lib/prisma'
import type { ScoreStudentRepository } from '@/core/domain/repositories/score-student'

const scoreStudentRepository: ScoreStudentRepository = {
  create: async (data) => {
    const result = await prisma.score.create({ data })
    return result
  },
  update: async (id, score) => {
    const result = await prisma.score.update({
      where: { id },
      data: { score },
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
      ...filter,
      where: {
        ...(filter.where ?? {}),
        assignmentId,
      },
      orderBy: filter.orderBy ?? { createdAt: 'asc' },
      include: {
        student: true,
      },
    })
    return result
  },
}

export default scoreStudentRepository
