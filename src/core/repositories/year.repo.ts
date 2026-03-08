import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { YearRepository } from '@/core/domain/repositories/year'

const yearRepository: YearRepository = {
  create: async (data) => {
    const year = await prisma.year.create({
      data: data as Prisma.YearUncheckedCreateInput,
    })
    return year
  },
  update: async (id, data) => {
    const result = await prisma.year.update({
      where: { id },
      data: data as Prisma.YearUncheckedUpdateInput,
    })
    return result
  },
  delete: async (id) => {
    await prisma.year.delete({ where: { id } })
  },
  getAll: async (filter = {}) => {
    const years = await prisma.year.findMany({
      ...(filter as unknown as Prisma.YearFindManyArgs),
      orderBy: { createdAt: 'desc' },
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
