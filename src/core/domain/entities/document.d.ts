// Auto-generated from prisma/schema.prisma. Do not edit manually.

import type { DocumentType, DocumentLanguage } from './enums'

export interface Document {
  id: string
  type: DocumentType
  version: string
  content: string
  language: DocumentLanguage
  isActive: boolean
  createdAt: Date
}
