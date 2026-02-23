import type { User } from '@/models/domain/user'

interface UserRepository {
  createUser(user: User): Promise<User | null>
  updateUser(id: string, user: Partial<User>): Promise<User | null>
  deleteUser(id: string): Promise<boolean>
  findUserByName(name: string): Promise<User | null>
  findUserById(id: string): Promise<User | null>
  oAuthCreateUser(id: string, user: Partial<User>): Promise<User | null>
  findWithObjectId(id: string): Promise<User | null>
}

export type { UserRepository }
