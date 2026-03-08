import type {
  YearCreateData,
  YearQuery,
  YearUpdateData,
} from '@/core/domain/data/year'
import type { YearRepository } from '@/core/domain/repositories/year'
import type { YearUseCase } from '@/core/domain/usecases/year'
import {
  yearCreateSchema,
  yearQuerySchema,
  yearUpdateSchema,
} from '@/core/domain/schema/year.schema'
import { AppError } from '@/lib/utils/error'
import { ensureFoundOrThrow, parseOrThrow, parseUuidOrThrow } from './_shared'

export const createYearUseCase = (repository: YearRepository): YearUseCase => ({
  create: async (data) => {
    const payload = parseOrThrow<YearCreateData>(yearCreateSchema, data)
    const existed = await repository.getUnique(
      payload.userId,
      payload.year,
      payload.term,
    )
    if (existed) {
      throw new AppError('ปีการศึกษาและเทอมนี้มีอยู่แล้ว', 'DATA_EXIST')
    }
    return repository.create(payload)
  },

  update: async (id, data) => {
    const parsedId = parseUuidOrThrow(id)
    ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบปีการศึกษาที่ต้องการแก้ไข',
    )

    const payload = parseOrThrow<YearUpdateData>(yearUpdateSchema, data)
    return repository.update(parsedId, payload)
  },

  delete: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบปีการศึกษาที่ต้องการลบ',
    )
    await repository.delete(parsedId)
  },

  getAll: async (filter) => {
    const payload = filter
      ? parseOrThrow<YearQuery>(yearQuerySchema, filter)
      : undefined
    return repository.getAll(payload)
  },

  getById: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    return ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบปีการศึกษา',
    )
  },

  getUnique: async (userId, year, term) => {
    const parsedUserId = parseUuidOrThrow(userId, 'userId')
    const parsedYear = parseOrThrow(yearCreateSchema.shape.year, year)
    const parsedTerm = parseOrThrow(yearCreateSchema.shape.term, term)
    return repository.getUnique(parsedUserId, parsedYear, parsedTerm)
  },

  setActive: async (userId, yearId) => {
    const parsedUserId = parseUuidOrThrow(userId, 'userId')
    const parsedYearId = parseUuidOrThrow(yearId, 'yearId')
    ensureFoundOrThrow(
      await repository.getById(parsedYearId),
      'ไม่พบปีการศึกษาที่ต้องการเปิดใช้งาน',
    )
    await repository.setActive(parsedUserId, parsedYearId)
  },

  getActiveByUser: async (userId) => {
    const parsedUserId = parseUuidOrThrow(userId, 'userId')
    return repository.getActiveByUser(parsedUserId)
  },
})
