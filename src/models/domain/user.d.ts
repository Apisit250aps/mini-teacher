interface User {
  id: string
  name: string
  password: string
  isActive: boolean
  isTeacher: boolean
  firstName?: string
  lastName?: string
  email?: string
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
}

interface CreateUser {
  name: string
  password: string
  isActive?: boolean
  isTeacher?: boolean
  firstName?: string
  lastName?: string
  email?: string
}

interface UpdateUser extends Partial<CreateUser> {
  id: string
}

interface UserLogin {
  name: string
  password: string
}

export type { User, CreateUser, UpdateUser, UserLogin }
