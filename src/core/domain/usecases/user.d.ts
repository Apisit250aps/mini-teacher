import type { UserCreateData, UserUpdateData } from '../data/user'
import type { UserRepository } from '../repositories/user'

interface UserUseCase {
  getAll: () => Promise<Awaited<ReturnType<UserRepository['getAll']>>>
  create: (
    data: UserCreateData,
  ) => Promise<Awaited<ReturnType<UserRepository['create']>>>
  update: (
    id: string,
    data: UserUpdateData,
  ) => Promise<Awaited<ReturnType<UserRepository['update']>>>
  delete: (id: string) => Promise<void>
  getById: (
    id: string,
  ) => Promise<Awaited<ReturnType<UserRepository['getById']>>>
  getByEmail: (
    email: string,
  ) => Promise<Awaited<ReturnType<UserRepository['getByEmail']>>>
}

export type { UserUseCase }
