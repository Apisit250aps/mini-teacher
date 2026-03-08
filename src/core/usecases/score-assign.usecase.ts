import type {
  ScoreAssignCreateData,
  ScoreAssignQuery,
  ScoreAssignUpdateData,
} from '@/core/domain/data/score-assign'
import type { ScoreAssignRepository } from '@/core/domain/repositories/score-assign'
import {
  assignmentCreateSchema,
  assignmentUpdateSchema,
  querySchema,
} from '@/core/domain/schema'
import { AppError } from '@/lib/utils/error'
import { ensureFoundOrThrow, parseOrThrow, parseUuidOrThrow } from './_shared'

export interface ScoreAssignUseCase {
  create: (
    data: unknown,
  ) => Promise<Awaited<ReturnType<ScoreAssignRepository['create']>>>
  update: (
    id: unknown,
    data: unknown,
  ) => Promise<Awaited<ReturnType<ScoreAssignRepository['update']>>>
  delete: (id: unknown) => Promise<void>
  getByClassId: (
    classId: unknown,
    filter?: unknown,
  ) => Promise<Awaited<ReturnType<ScoreAssignRepository['getByClassId']>>>
  getById: (
    classId: unknown,
    assignId: unknown,
  ) => Promise<Awaited<ReturnType<ScoreAssignRepository['getById']>>>
}

const scoreAssignQuerySchema = querySchema

export const createScoreAssignUseCase = (
  repository: ScoreAssignRepository,
): ScoreAssignUseCase => ({
  create: async (data) => {
    const payload = parseOrThrow<ScoreAssignCreateData>(
      assignmentCreateSchema,
      data,
    )
    const existed = await repository.getUniqueByTitle(
      payload.classId,
      payload.title,
    )
    if (existed) {
      throw new AppError(
        'ชื่องานคะแนนนี้มีอยู่แล้วในห้องเรียนนี้',
        'DATA_EXIST',
      )
    }
    return repository.create(payload)
  },

  update: async (id, data) => {
    const parsedId = parseUuidOrThrow(id)
    const payload = parseOrThrow<ScoreAssignUpdateData>(
      assignmentUpdateSchema,
      data,
    )
    return repository.update(parsedId, payload)
  },

  delete: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    await repository.delete(parsedId)
  },

  getByClassId: async (classId, filter) => {
    const parsedClassId = parseUuidOrThrow(classId, 'classId')
    const parsedFilter = filter
      ? parseOrThrow<ScoreAssignQuery>(scoreAssignQuerySchema, filter)
      : undefined
    return repository.getByClassId(parsedClassId, parsedFilter)
  },

  getById: async (classId, assignId) => {
    const parsedClassId = parseUuidOrThrow(classId, 'classId')
    const parsedAssignId = parseUuidOrThrow(assignId, 'assignId')
    return ensureFoundOrThrow(
      await repository.getById(parsedClassId, parsedAssignId),
      'ไม่พบงานคะแนน',
    )
  },
})
