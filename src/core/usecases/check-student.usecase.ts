import type {
  CheckStudentCreateData,
  CheckStudentQuery,
  CheckStudentUpdateData,
} from '@/core/domain/data/check-student'
import type { CheckStudentRepository } from '@/core/domain/repositories/check-student'
import type { CheckStudentUseCase } from '@/core/domain/usecases/check-student'
import {
  checkStudentCreateSchema,
  checkStudentQuerySchema,
  checkStudentUpdateSchema,
} from '@/core/domain/schema/check-student.schema'
import { AppError } from '@/lib/utils/error'
import { ensureFoundOrThrow, parseOrThrow, parseUuidOrThrow } from './_shared'

export const createCheckStudentUseCase = (
  repository: CheckStudentRepository,
): CheckStudentUseCase => ({
  create: async (data) => {
    const payload = parseOrThrow<CheckStudentCreateData>(
      checkStudentCreateSchema,
      data,
    )

    const existed = await repository.getUnique(
      payload.checkDateId,
      payload.studentId,
    )
    if (existed) {
      throw new AppError('มีข้อมูลเช็กชื่อของนักเรียนคนนี้แล้ว', 'DATA_EXIST')
    }

    return repository.create(payload)
  },

  update: async (id, data) => {
    const parsedId = parseUuidOrThrow(id)
    ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบข้อมูลเช็กชื่อที่ต้องการแก้ไข',
    )

    const payload = parseOrThrow<CheckStudentUpdateData>(
      checkStudentUpdateSchema,
      data,
    )
    return repository.update(parsedId, payload)
  },

  delete: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบข้อมูลเช็กชื่อที่ต้องการลบ',
    )
    await repository.delete(parsedId)
  },

  getById: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    return ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบข้อมูลเช็กชื่อ',
    )
  },

  getUnique: async (checkDateId, studentId) => {
    const parsedCheckDateId = parseUuidOrThrow(checkDateId, 'checkDateId')
    const parsedStudentId = parseUuidOrThrow(studentId, 'studentId')
    return repository.getUnique(parsedCheckDateId, parsedStudentId)
  },

  getByCheckDateId: async (checkDateId, filter) => {
    const parsedCheckDateId = parseUuidOrThrow(checkDateId, 'checkDateId')
    const parsedFilter = filter
      ? parseOrThrow<CheckStudentQuery>(checkStudentQuerySchema, filter)
      : undefined
    return repository.getByCheckDateId(parsedCheckDateId, parsedFilter)
  },
})
