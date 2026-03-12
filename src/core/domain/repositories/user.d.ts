import type { User } from '../entities/user'
import type {
  UserCreateData,
  UserUpdateData,
  UserWithYears,
} from '../data/user'

interface UserRepository {
  getAll: () => Promise<User[]>
  getById: (id: string) => Promise<UserWithYears | null>
  getByEmail: (email: string) => Promise<UserWithYears | null>
  create: (data: UserCreateData) => Promise<User>
  update: (id: string, data: UserUpdateData) => Promise<User>
  delete: (id: string) => Promise<void>
}

export type { UserRepository, UserWithYears }
