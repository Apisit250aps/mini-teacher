import type {
  DocumentCreateData,
  DocumentQuery,
  DocumentUpdateData,
} from '@/core/domain/data/document'
import type {
  DocumentType,
  DocumentLanguage,
} from '@/core/domain/entities/enums'
import type { DocumentRepository } from '@/core/domain/repositories/document'
import type { DocumentUseCase } from '@/core/domain/usecases/document'
import {
  documentCreateSchema,
  documentQuerySchema,
  documentUpdateSchema,
} from '@/core/domain/schema/document.schema'
import {
  documentTypeSchema,
  documentLanguageSchema,
} from '@/core/domain/schema/enums'
import { AppError } from '@/lib/utils/error'
import { ensureFoundOrThrow, parseOrThrow } from './_shared'

export const createDocumentUseCase = (
  repository: DocumentRepository,
): DocumentUseCase => ({
  getAll: async (filter) => {
    const payload = filter
      ? parseOrThrow<DocumentQuery>(documentQuerySchema, filter)
      : undefined
    return repository.getAll(payload)
  },

  getById: async (id) => {
    return ensureFoundOrThrow(await repository.getById(id), 'ไม่พบเอกสาร')
  },

  getLatestByType: async (type, language?: DocumentLanguage) => {
    const parsedType = parseOrThrow<DocumentType>(documentTypeSchema, type)
    const parsedLang = language
      ? parseOrThrow<DocumentLanguage>(documentLanguageSchema, language)
      : undefined
    return repository.getLatestByType(parsedType, parsedLang)
  },

  create: async (data) => {
    const payload = parseOrThrow<DocumentCreateData>(documentCreateSchema, data)
    const existing = await repository.getAll({
      where: { type: payload.type, version: payload.version },
    })
    if (existing.length > 0) {
      throw new AppError('เอกสารประเภทนี้เวอร์ชันนี้มีอยู่แล้ว', 'DATA_EXIST')
    }
    return repository.create(payload)
  },

  update: async (id, data) => {
    ensureFoundOrThrow(
      await repository.getById(id),
      'ไม่พบเอกสารที่ต้องการแก้ไข',
    )
    const payload = parseOrThrow<DocumentUpdateData>(documentUpdateSchema, data)
    return repository.update(id, payload)
  },

  delete: async (id) => {
    ensureFoundOrThrow(await repository.getById(id), 'ไม่พบเอกสารที่ต้องการลบ')
    await repository.delete(id)
  },
})
