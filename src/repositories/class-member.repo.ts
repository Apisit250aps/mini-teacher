import { prisma } from '@/lib/prisma'
import type { ClassMemberRepository } from './types/class-member'

const classMemberRepository: ClassMemberRepository = {
  create: async (data) => {
    const result = await prisma.classMember.create({ data })
    return result
  },
  delete: async (classId, studentId) => {
    await prisma.classMember.deleteMany({
      where: {
        classId,
        studentId,
      },
    })
  },
  getUnique: async (classId, studentId) => {
    const result = await prisma.classMember.findUnique({
      where: {
        classId_studentId: {
          classId,
          studentId,
        },
      },
    })
    return result
  },
  getByClassId: async (classId, filter = {}) => {
    const result = await prisma.classMember.findMany({
      ...filter,
      where: {
        ...(filter.where ?? {}),
        classId,
      },
      orderBy: filter.orderBy ?? { createdAt: 'asc' },
      include: {
        student: true,
      },
    })
    return result
  },
}

export default classMemberRepository
