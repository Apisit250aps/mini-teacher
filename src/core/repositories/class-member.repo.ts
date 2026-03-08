import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { ClassMemberRepository } from '@/core/domain/repositories/class-member'

const classMemberRepository: ClassMemberRepository = {
  create: async (data) => {
    const result = await prisma.classMember.create({
      data: data as Prisma.ClassMemberUncheckedCreateInput,
    })
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
      ...(filter as unknown as Prisma.ClassMemberFindManyArgs),
      where: {
        ...((filter.where ?? {}) as Prisma.ClassMemberWhereInput),
        classId,
      },
      orderBy:
        (filter.orderBy as Prisma.ClassMemberOrderByWithRelationInput) ?? {
          createdAt: 'asc',
        },
      include: {
        student: true,
      },
    })
    return result
  },
}

export default classMemberRepository
