import type {
  ClassCreateData,
  ClassQuery,
  ClassUpdateData,
} from '@/core/domain/data/class'
import type { ClassRepository } from '@/core/domain/repositories/class'
import {
  classCreateSchema,
  classQuerySchema,
  classUpdateSchema,
} from '@/core/domain/schema/class.schema'
import { AppError } from '@/lib/utils/error'
import { ensureFoundOrThrow, parseOrThrow, parseUuidOrThrow } from './_shared'

export interface ClassUseCase {
  create: (
    data: unknown,
  ) => Promise<Awaited<ReturnType<ClassRepository['create']>>>
  update: (
    id: unknown,
    data: unknown,
  ) => Promise<Awaited<ReturnType<ClassRepository['update']>>>
  delete: (id: unknown) => Promise<void>
  getById: (
    id: unknown,
  ) => Promise<Awaited<ReturnType<ClassRepository['getById']>>>
  getByYearId: (
    yearId: unknown,
    filter?: unknown,
  ) => Promise<Awaited<ReturnType<ClassRepository['getByYearId']>>>
  getByYearAndClassId: (
    yearId: unknown,
    classId: unknown,
  ) => Promise<Awaited<ReturnType<ClassRepository['getByYearAndClassId']>>>
}

export const createClassUseCase = (
  repository: ClassRepository,
): ClassUseCase => ({
  create: async (data) => {
    const payload = parseOrThrow<ClassCreateData>(classCreateSchema, data)
    const existed = await repository.getUniqueByName(
      payload.yearId,
      payload.name,
    )
    if (existed) {
      throw new AppError(
        'ชื่อห้องเรียนนี้มีอยู่แล้วในปีการศึกษาเดียวกัน',
        'DATA_EXIST',
      )
    }
    return repository.create(payload)
  },

  update: async (id, data) => {
    const parsedId = parseUuidOrThrow(id)
    const current = ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบห้องเรียนที่ต้องการแก้ไข',
    )

    const payload = parseOrThrow<ClassUpdateData>(classUpdateSchema, data)

    const targetYearId = payload.yearId ?? current.yearId
    const targetName = payload.name ?? current.name
    const existed = await repository.getUniqueByName(targetYearId, targetName)
    if (existed && existed.id !== parsedId) {
      throw new AppError(
        'ชื่อห้องเรียนนี้มีอยู่แล้วในปีการศึกษาเดียวกัน',
        'DATA_EXIST',
      )
    }

    return repository.update(parsedId, payload)
  },

  delete: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบห้องเรียนที่ต้องการลบ',
    )
    await repository.delete(parsedId)
  },

  getById: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    return ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบห้องเรียน',
    )
  },

  getByYearId: async (yearId, filter) => {
    const parsedYearId = parseUuidOrThrow(yearId, 'yearId')
    const parsedFilter = filter
      ? parseOrThrow<ClassQuery>(classQuerySchema, filter)
      : undefined
    return repository.getByYearId(parsedYearId, parsedFilter)
  },

  getByYearAndClassId: async (yearId, classId) => {
    const parsedYearId = parseUuidOrThrow(yearId, 'yearId')
    const parsedClassId = parseUuidOrThrow(classId, 'classId')
    return ensureFoundOrThrow(
      await repository.getByYearAndClassId(parsedYearId, parsedClassId),
      'ไม่พบห้องเรียน',
    )
  },
})
