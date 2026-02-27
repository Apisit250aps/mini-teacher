import { prisma } from '@/lib/prisma'
import { YearRepo } from './types/year'

const YearRepository: YearRepo = {
  create: async (data) => {
    const year = await prisma.year.create({ data: data })
    return year
  },
  update: async (id, data) => {
    const result = await prisma.year.update({ where: { id }, data: data })
    return result
  },
  delete: async (id) => {
    await prisma.year.delete({ where: { id } })
  },
  getAll: async (filter) => {
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
}

export default YearRepository
