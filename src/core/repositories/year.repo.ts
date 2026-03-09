import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { YearRepository } from '@/core/domain/repositories/year'

const ensureUserExists = async (userId: string): Promise<void> => {
  const existing = await prisma.user.findUnique({ where: { id: userId } })
  if (!existing) {
    throw new Error(`User not found for userId: ${userId}`)
  }
}

const yearRepository: YearRepository = {
  create: async (data) => {
    await ensureUserExists(data.userId)

    const year = await prisma.year.create({
      data: {
        userId: data.userId,
        year: data.year,
        term: data.term,
        description: data.description,
        isActive: data.isActive,
      },
    })
    return year
  },
  update: async (id, data) => {
    const result = await prisma.year.update({
      where: { id },
      data: {
        year: data.year,
        term: data.term,
        description: data.description,
        isActive: data.isActive,
      },
    })
    return result
  },
  delete: async (id) => {
    await prisma.year.delete({ where: { id } })
  },
  getAll: async (filter = {}) => {
    const years = await prisma.year.findMany({
      ...(filter as unknown as Prisma.YearFindManyArgs),
      include: {
        classes: true,
      },
    })
    return years
  },
  getById: async (id) => {
    const year = await prisma.year.findUnique({
      where: { id },
      include: { classes: true, owner: true },
    })
    return year
  },
  getUnique: async (userId, year, term) => {
    const result = await prisma.year.findFirst({
      where: {
        userId,
        year,
        term,
      },
      include: {
        classes: true,
      },
    })
    return result
  },
  setActive: async (userId, yearId) => {
    await prisma.$transaction([
      prisma.year.updateMany({
        where: { userId },
        data: { isActive: false },
      }),
      prisma.year.update({
        where: { id: yearId, userId },
        data: { isActive: true },
      }),
    ])
  },
  getActiveByUser: async (userId) => {
    const result = await prisma.year.findFirst({
      where: { userId, isActive: true },
    })
    return result
  },
}

export default yearRepository
