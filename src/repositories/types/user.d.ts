import type { User, Prisma } from '@prisma'

type UserRepository = {
  getById: (id: string) => Promise<User | null>
  getByEmail: (email: string) => Promise<User | null>
  create: (user: Prisma.UserCreateInput) => Promise<User>
  update: (id: string, user: Prisma.UserUpdateInput) => Promise<User>
  delete: (id: string) => Promise<void>
}
