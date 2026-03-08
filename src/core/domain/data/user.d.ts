import type { User } from '../entities/user'
import type { Year } from '../entities/year'

export type UserWithYears = User & {
  years: Year[]
}

export interface UserCreateData {
  name?: string | null
  password?: string | null
  email?: string | null
  emailVerified?: Date | null
  image?: string | null
  isActive?: boolean
  isTeacher?: boolean
  isAdmin?: boolean
  firstName?: string | null
  lastName?: string | null
}

export interface UserUpdateData {
  name?: string | null
  password?: string | null
  email?: string | null
  emailVerified?: Date | null
  image?: string | null
  isActive?: boolean
  isTeacher?: boolean
  isAdmin?: boolean
  firstName?: string | null
  lastName?: string | null
}
