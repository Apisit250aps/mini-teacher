import { prisma } from '@/lib/prisma'
import type { StudentRepository } from './types/student'

const studentRepository: StudentRepository = {
  create: async (data) => {
    const result = await prisma.student.create({ data })
    return result
  },
  update: async (id, data) => {
    const result = await prisma.student.update({
      where: { id },
      data,
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
      ...filter,
      where: {
        ...(filter.where ?? {}),
        teacherId,
      },
      orderBy: filter.orderBy ?? { code: 'asc' },
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
