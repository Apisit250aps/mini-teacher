// Auto-generated from prisma/schema.prisma. Do not edit manually.

export interface User {
  id: string
  name?: string | null
  password?: string | null
  email?: string | null
  emailVerified?: Date | null
  image?: string | null
  isActive: boolean
  isTeacher: boolean
  isAdmin: boolean
  firstName?: string | null
  lastName?: string | null
  createdAt: Date
  updatedAt: Date
}
