import { prisma } from '@/lib/prisma'
import type { YearRepository } from '@/domain/year'

const yearRepository: YearRepository = {
  create: async (data) => {
    const year = await prisma.year.create({ data })
    return year
  },
  update: async (id, data) => {
    const result = await prisma.year.update({ where: { id }, data })
    return result
  },
  delete: async (id) => {
    await prisma.year.delete({ where: { id } })
  },
  getAll: async (filter = {}) => {
    const years = await prisma.year.findMany({
      ...filter,
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
