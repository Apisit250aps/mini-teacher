import { prisma } from '@/lib/prisma'
import { UserRepository } from './types/user'

const userRepository: UserRepository = {
  getById: async (id) => {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { years: true },
    })
    return user
  },
  getByEmail: async (email) => {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { years: true },
    })
    return user
  },
  create: async (data) => {
    const user = await prisma.user.create({ data })
    return user
  },
  update: async (id, data) => {
    const user = await prisma.user.update({ where: { id }, data })
    return user
  },
  delete: async (id) => {
    await prisma.user.delete({ where: { id } })
  },
}

export default userRepository
