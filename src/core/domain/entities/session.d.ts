// Auto-generated from prisma/schema.prisma. Do not edit manually.

export interface Session {
  id: string
  sessionToken: string
  userId: string
  expires: Date
  createdAt: Date
  updatedAt: Date
}
