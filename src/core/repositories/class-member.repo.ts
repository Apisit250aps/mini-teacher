import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { ClassMemberRepository } from '@/core/domain/repositories/class-member'

const ensureClassExists = async (classId: string): Promise<void> => {
  const existing = await prisma.class.findUnique({ where: { id: classId } })
  if (!existing) {
    throw new Error(`Class not found for classId: ${classId}`)
  }
}

const ensureStudentExists = async (studentId: string): Promise<void> => {
  const existing = await prisma.student.findUnique({ where: { id: studentId } })
  if (!existing) {
    throw new Error(`Student not found for studentId: ${studentId}`)
  }
}

const ensureUserExists = async (userId: string): Promise<void> => {
  const existing = await prisma.user.findUnique({ where: { id: userId } })
  if (!existing) {
    throw new Error(`User not found for userId: ${userId}`)
  }
}

const classMemberRepository: ClassMemberRepository = {
  create: async (data) => {
    const guards: Array<Promise<void>> = [
      ensureClassExists(data.classId),
      ensureStudentExists(data.studentId),
    ]
    if (data.userId) {
      guards.push(ensureUserExists(data.userId))
    }
    await Promise.all(guards)

    const result = await prisma.classMember.create({
      data: {
        classId: data.classId,
        studentId: data.studentId,
        userId: data.userId,
      },
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
          student: {
            code: 'asc',
          },
        },
      include: {
        student: true,
      },
    })
    return result
  },
}

export default classMemberRepository
