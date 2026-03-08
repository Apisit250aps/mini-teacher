// Auto-generated from prisma/schema.prisma. Do not edit manually.

export interface Year {
  id: string
  userId: string
  year: number
  term: number
  description?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
