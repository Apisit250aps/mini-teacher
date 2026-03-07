import type { Prisma, User } from '@prisma'

type UserWithYears = Prisma.UserGetPayload<{
  include: { years: true }
}>

type UserRepository = {
  getById: (id: string) => Promise<UserWithYears | null>
  getByEmail: (email: string) => Promise<UserWithYears | null>
  create: (data: Prisma.UserCreateInput) => Promise<User>
  update: (id: string, data: Prisma.UserUpdateInput) => Promise<User>
  delete: (id: string) => Promise<void>
}

export type { UserRepository, UserWithYears }
