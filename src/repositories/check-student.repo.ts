import { prisma } from '@/lib/prisma'
import type { CheckStudentRepository } from './types/check-student'

const checkStudentRepository: CheckStudentRepository = {
  create: async (data) => {
    const result = await prisma.checkStudent.create({ data })
    return result
  },
  update: async (id, data) => {
    const result = await prisma.checkStudent.update({
      where: { id },
      data,
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
      ...filter,
      where: {
        ...(filter.where ?? {}),
        checkDateId,
      },
      orderBy: filter.orderBy ?? { createdAt: 'asc' },
      include: {
        student: true,
        checkDate: true,
      },
    })
    return result
  },
}

export default checkStudentRepository
