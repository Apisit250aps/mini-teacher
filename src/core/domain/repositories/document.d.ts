import type { Document } from '../entities/document'
import type { DocumentType } from '../entities/enums'
import type {
  DocumentCreateData,
  DocumentQuery,
  DocumentUpdateData,
  DocumentWithAcceptances,
} from '../data/document'

interface DocumentRepository {
  getAll: (filter?: DocumentQuery) => Promise<Document[]>
  getById: (id: string) => Promise<DocumentWithAcceptances | null>
  getLatestByType: (type: DocumentType) => Promise<Document | null>
  create: (data: DocumentCreateData) => Promise<Document>
  update: (id: string, data: DocumentUpdateData) => Promise<Document>
  delete: (id: string) => Promise<void>
}

export type { DocumentRepository }
