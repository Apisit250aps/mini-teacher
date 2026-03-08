// Auto-generated from prisma/schema.prisma. Do not edit manually.

export interface Student {
  id: string
  teacherId: string
  code: string
  prefix?: string | null
  firstName: string
  lastName: string
  nickname?: string | null
  createdAt: Date
  updatedAt: Date
}
