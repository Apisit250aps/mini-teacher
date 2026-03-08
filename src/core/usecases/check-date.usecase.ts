import type {
  CheckDateCreateData,
  CheckDateQuery,
  CheckDateUpdateData,
} from '@/core/domain/data/check-date'
import type { CheckDateRepository } from '@/core/domain/repositories/check-date'
import {
  checkDateCreateSchema,
  checkDateQuerySchema,
  checkDateUpdateSchema,
} from '@/core/domain/schema/check-date.schema'
import { AppError } from '@/lib/utils/error'
import { ensureFoundOrThrow, parseOrThrow, parseUuidOrThrow } from './_shared'

export interface CheckDateUseCase {
  create: (
    data: unknown,
  ) => Promise<Awaited<ReturnType<CheckDateRepository['create']>>>
  update: (
    id: unknown,
    data: unknown,
  ) => Promise<Awaited<ReturnType<CheckDateRepository['update']>>>
  delete: (id: unknown) => Promise<void>
  getById: (
    id: unknown,
  ) => Promise<Awaited<ReturnType<CheckDateRepository['getById']>>>
  getByClassId: (
    classId: unknown,
    filter?: unknown,
  ) => Promise<Awaited<ReturnType<CheckDateRepository['getByClassId']>>>
}

export const createCheckDateUseCase = (
  repository: CheckDateRepository,
): CheckDateUseCase => ({
  create: async (data) => {
    const payload = parseOrThrow<CheckDateCreateData>(
      checkDateCreateSchema,
      data,
    )
    const existed = await repository.getUniqueByDate(
      payload.classId,
      payload.date,
    )
    if (existed) {
      throw new AppError('มีวันเช็กชื่อนี้อยู่แล้วในห้องเรียนนี้', 'DATA_EXIST')
    }
    return repository.create(payload)
  },

  update: async (id, data) => {
    const parsedId = parseUuidOrThrow(id)
    const current = ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบวันเช็กชื่อที่ต้องการแก้ไข',
    )

    const payload = parseOrThrow<CheckDateUpdateData>(
      checkDateUpdateSchema,
      data,
    )
    if (payload.date) {
      const existed = await repository.getUniqueByDate(
        current.classId,
        payload.date,
      )
      if (existed && existed.id !== parsedId) {
        throw new AppError(
          'มีวันเช็กชื่อนี้อยู่แล้วในห้องเรียนนี้',
          'DATA_EXIST',
        )
      }
    }

    return repository.update(parsedId, payload)
  },

  delete: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบวันเช็กชื่อที่ต้องการลบ',
    )
    await repository.delete(parsedId)
  },

  getById: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    return ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบวันเช็กชื่อ',
    )
  },

  getByClassId: async (classId, filter) => {
    const parsedClassId = parseUuidOrThrow(classId, 'classId')
    const parsedFilter = filter
      ? parseOrThrow<CheckDateQuery>(checkDateQuerySchema, filter)
      : undefined
    return repository.getByClassId(parsedClassId, parsedFilter)
  },
})
