// Auto-generated from prisma/schema.prisma. Do not edit manually.

import type { CheckStatus } from './enums'

export interface CheckStudent {
  id: string
  checkDateId: string
  studentId: string
  status: CheckStatus
  createdAt: Date
  updatedAt: Date
}
