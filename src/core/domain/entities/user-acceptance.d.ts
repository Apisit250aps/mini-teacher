// Auto-generated from prisma/schema.prisma. Do not edit manually.

export interface UserAcceptance {
  id: string
  userId: string
  documentId: string
  acceptedAt: Date
  ipAddress?: string | null
  userAgent?: string | null
}
