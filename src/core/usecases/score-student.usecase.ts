import type {
  ScoreStudentCreateData,
  ScoreStudentQuery,
  ScoreStudentUpdateData,
} from '@/core/domain/data/score-student'
import type { ScoreStudentRepository } from '@/core/domain/repositories/score-student'
import type { ScoreStudentUseCase } from '@/core/domain/usecases/score-student'
import {
  scoreCreateSchema,
  scoreQuerySchema,
  scoreUpdateSchema,
} from '@/core/domain/schema/score.schema'
import { AppError } from '@/lib/utils/error'
import { parseOrThrow, parseUuidOrThrow } from './_shared'

export const createScoreStudentUseCase = (
  repository: ScoreStudentRepository,
): ScoreStudentUseCase => ({
  create: async (data) => {
    const payload = parseOrThrow<ScoreStudentCreateData>(
      scoreCreateSchema,
      data,
    )

    const existed = await repository.getUnique(
      payload.assignmentId,
      payload.studentId,
    )
    if (existed) {
      throw new AppError('มีคะแนนของนักเรียนคนนี้ในงานนี้แล้ว', 'DATA_EXIST')
    }

    return repository.create(payload)
  },

  update: async (id, data) => {
    const parsedId = parseUuidOrThrow(id)
    const payload = parseOrThrow<ScoreStudentUpdateData>(
      scoreUpdateSchema,
      data,
    )
    return repository.update(parsedId, payload)
  },

  delete: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    await repository.delete(parsedId)
  },

  getUnique: async (assignmentId, studentId) => {
    const parsedAssignmentId = parseUuidOrThrow(assignmentId, 'assignmentId')
    const parsedStudentId = parseUuidOrThrow(studentId, 'studentId')
    return repository.getUnique(parsedAssignmentId, parsedStudentId)
  },

  getByAssignmentId: async (assignmentId, filter) => {
    const parsedAssignmentId = parseUuidOrThrow(assignmentId, 'assignmentId')
    const parsedFilter = filter
      ? parseOrThrow<ScoreStudentQuery>(scoreQuerySchema, filter)
      : undefined
    return repository.getByAssignmentId(parsedAssignmentId, parsedFilter)
  },
})
