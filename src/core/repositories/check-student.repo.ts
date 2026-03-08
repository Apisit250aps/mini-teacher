import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { CheckStudentRepository } from '@/core/domain/repositories/check-student'

const ensureCheckDateExists = async (checkDateId: string): Promise<void> => {
  const existing = await prisma.checkDate.findUnique({
    where: { id: checkDateId },
  })
  if (!existing) {
    throw new Error(`CheckDate not found for checkDateId: ${checkDateId}`)
  }
}

const ensureStudentExists = async (studentId: string): Promise<void> => {
  const existing = await prisma.student.findUnique({ where: { id: studentId } })
  if (!existing) {
    throw new Error(`Student not found for studentId: ${studentId}`)
  }
}

const checkStudentRepository: CheckStudentRepository = {
  create: async (data) => {
    await Promise.all([
      ensureCheckDateExists(data.checkDateId),
      ensureStudentExists(data.studentId),
    ])

    const result = await prisma.checkStudent.create({
      data: {
        checkDateId: data.checkDateId,
        studentId: data.studentId,
        status: data.status,
      },
    })
    return result
  },
  update: async (id, data) => {
    const result = await prisma.checkStudent.update({
      where: { id },
      data: {
        status: data.status,
      },
    })
    return result
  },
  delete: async (id) => {
    await prisma.checkStudent.delete({ where: { id } })
  },
  getById: async (id) => {
    const result = await prisma.checkStudent.findUnique({
      where: { id },
      include: {
        student: true,
        checkDate: true,
      },
    })
    return result
  },
  getUnique: async (checkDateId, studentId) => {
    const result = await prisma.checkStudent.findUnique({
      where: {
        checkDateId_studentId: {
          checkDateId,
          studentId,
        },
      },
      include: {
        student: true,
        checkDate: true,
      },
    })
    return result
  },
  getByCheckDateId: async (checkDateId, filter = {}) => {
    const result = await prisma.checkStudent.findMany({
      ...(filter as unknown as Prisma.CheckStudentFindManyArgs),
      where: {
        ...((filter.where ?? {}) as Prisma.CheckStudentWhereInput),
        checkDateId,
      },
      orderBy:
        (filter.orderBy as Prisma.CheckStudentOrderByWithRelationInput) ?? {
          createdAt: 'asc',
        },
      include: {
        student: true,
        checkDate: true,
      },
    })
    return result
  },
}

export default checkStudentRepository
