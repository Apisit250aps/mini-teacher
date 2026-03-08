import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma'
import type { UserRepository } from '@/core/domain/repositories/user'

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
    const user = await prisma.user.create({
      data: data as Prisma.UserUncheckedCreateInput,
    })
    return user
  },
  update: async (id, data) => {
    const user = await prisma.user.update({
      where: { id },
      data: data as Prisma.UserUncheckedUpdateInput,
    })
    return user
  },
  delete: async (id) => {
    await prisma.user.delete({ where: { id } })
  },
}

export default userRepository
