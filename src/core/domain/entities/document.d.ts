// Auto-generated from prisma/schema.prisma. Do not edit manually.

import type { DocumentType } from './enums'

export interface Document {
  id: string
  type: DocumentType
  version: string
  content: string
  isActive: boolean
  createdAt: Date
}
