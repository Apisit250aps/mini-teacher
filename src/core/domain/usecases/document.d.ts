import type { DocumentType, DocumentLanguage } from '../entities/enums'
import type {
  DocumentCreateData,
  DocumentQuery,
  DocumentUpdateData,
} from '../data/document'
import type { DocumentRepository } from '../repositories/document'

interface DocumentUseCase {
  getAll: (
    filter?: DocumentQuery,
  ) => Promise<Awaited<ReturnType<DocumentRepository['getAll']>>>
  getById: (
    id: string,
  ) => Promise<Awaited<ReturnType<DocumentRepository['getById']>>>
  getLatestByType: (
    type: DocumentType,
    language?: DocumentLanguage,
  ) => Promise<Awaited<ReturnType<DocumentRepository['getLatestByType']>>>
  create: (
    data: DocumentCreateData,
  ) => Promise<Awaited<ReturnType<DocumentRepository['create']>>>
  update: (
    id: string,
    data: DocumentUpdateData,
  ) => Promise<Awaited<ReturnType<DocumentRepository['update']>>>
  delete: (id: string) => Promise<void>
}

export type { DocumentUseCase }
