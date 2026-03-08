import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { ClassRepository } from '@/core/domain/repositories/class'

const ensureYearExists = async (yearId: string): Promise<void> => {
  const existing = await prisma.year.findUnique({ where: { id: yearId } })
  if (!existing) {
    throw new Error(`Year not found for yearId: ${yearId}`)
  }
}

const classRepository: ClassRepository = {
  create: async (data) => {
    await ensureYearExists(data.yearId)

    const result = await prisma.class.create({
      data: {
        yearId: data.yearId,
        name: data.name,
        subject: data.subject,
        description: data.description,
        isActive: data.isActive,
      },
    })
    return result
  },
  update: async (id, data) => {
    if (data.yearId) {
      await ensureYearExists(data.yearId)
    }

    const result = await prisma.class.update({
      where: { id },
      data: {
        yearId: data.yearId,
        name: data.name,
        subject: data.subject,
        description: data.description,
        isActive: data.isActive,
      },
    })
    return result
  },
  delete: async (id) => {
    await prisma.class.delete({ where: { id } })
  },
  getById: async (id) => {
    const result = await prisma.class.findUnique({
      where: { id },
      include: {
        year: true,
        classMembers: {
          include: {
            student: true,
          },
        },
        checkDates: true,
        assignments: true,
      },
    })
    return result
  },
  getByYearId: async (yearId, filter = {}) => {
    const result = await prisma.class.findMany({
      ...(filter as unknown as Prisma.ClassFindManyArgs),
      where: {
        ...((filter.where ?? {}) as Prisma.ClassWhereInput),
        yearId,
      },
      orderBy: (filter.orderBy as Prisma.ClassOrderByWithRelationInput) ?? {
        createdAt: 'asc',
      },
      include: {
        classMembers: {
          include: {
            student: true,
          },
        },
      },
    })
    return result
  },
  getByYearAndClassId: async (yearId, classId) => {
    const result = await prisma.class.findFirst({
      where: {
        id: classId,
        yearId,
      },
      include: {
        year: true,
        classMembers: {
          include: {
            student: true,
          },
        },
        checkDates: true,
        assignments: true,
      },
    })
    return result
  },
  getUniqueByName: async (yearId, name) => {
    const result = await prisma.class.findFirst({
      where: {
        yearId,
        name,
      },
    })
    return result
  },
}

export default classRepository
