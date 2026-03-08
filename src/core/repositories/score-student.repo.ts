import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { ScoreStudentRepository } from '@/core/domain/repositories/score-student'

const ensureAssignmentExists = async (assignmentId: string): Promise<void> => {
  const existing = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  })
  if (!existing) {
    throw new Error(`Assignment not found for assignmentId: ${assignmentId}`)
  }
}

const ensureStudentExists = async (studentId: string): Promise<void> => {
  const existing = await prisma.student.findUnique({ where: { id: studentId } })
  if (!existing) {
    throw new Error(`Student not found for studentId: ${studentId}`)
  }
}

const scoreStudentRepository: ScoreStudentRepository = {
  create: async (data) => {
    await Promise.all([
      ensureAssignmentExists(data.assignmentId),
      ensureStudentExists(data.studentId),
    ])

    const result = await prisma.score.create({
      data: {
        assignmentId: data.assignmentId,
        studentId: data.studentId,
        score: data.score,
      },
    })
    return result
  },
  update: async (id, data) => {
    const result = await prisma.score.update({
      where: { id },
      data: {
        score: data.score,
      },
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
