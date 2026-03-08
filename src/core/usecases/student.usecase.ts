import type {
  StudentCreateData,
  StudentQuery,
  StudentUpdateData,
} from '@/core/domain/data/student'
import type { StudentRepository } from '@/core/domain/repositories/student'
import {
  studentCreateSchema,
  studentQuerySchema,
  studentUpdateSchema,
} from '@/core/domain/schema/student.schema'
import { AppError } from '@/lib/utils/error'
import { ensureFoundOrThrow, parseOrThrow, parseUuidOrThrow } from './_shared'

export interface StudentUseCase {
  create: (
    data: unknown,
  ) => Promise<Awaited<ReturnType<StudentRepository['create']>>>
  update: (
    id: unknown,
    data: unknown,
  ) => Promise<Awaited<ReturnType<StudentRepository['update']>>>
  delete: (id: unknown) => Promise<void>
  getById: (
    id: unknown,
  ) => Promise<Awaited<ReturnType<StudentRepository['getById']>>>
  getAllByTeacher: (
    teacherId: unknown,
    filter?: unknown,
  ) => Promise<Awaited<ReturnType<StudentRepository['getAllByTeacher']>>>
}

export const createStudentUseCase = (
  repository: StudentRepository,
): StudentUseCase => ({
  create: async (data) => {
    const payload = parseOrThrow<StudentCreateData>(studentCreateSchema, data)
    const existed = await repository.getUniqueByCode(
      payload.teacherId,
      payload.code,
    )
    if (existed) {
      throw new AppError('รหัสนักเรียนนี้มีอยู่แล้ว', 'DATA_EXIST')
    }
    return repository.create(payload)
  },

  update: async (id, data) => {
    const parsedId = parseUuidOrThrow(id)
    const current = ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบนักเรียนที่ต้องการแก้ไข',
    )

    const payload = parseOrThrow<StudentUpdateData>(studentUpdateSchema, data)
    if (payload.code) {
      const existed = await repository.getUniqueByCode(
        current.teacherId,
        payload.code,
      )
      if (existed && existed.id !== parsedId) {
        throw new AppError('รหัสนักเรียนนี้มีอยู่แล้ว', 'DATA_EXIST')
      }
    }

    return repository.update(parsedId, payload)
  },

  delete: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบนักเรียนที่ต้องการลบ',
    )
    await repository.delete(parsedId)
  },

  getById: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    return ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบนักเรียน',
    )
  },

  getAllByTeacher: async (teacherId, filter) => {
    const parsedTeacherId = parseUuidOrThrow(teacherId, 'teacherId')
    const parsedFilter = filter
      ? parseOrThrow<StudentQuery>(studentQuerySchema, filter)
      : undefined
    return repository.getAllByTeacher(parsedTeacherId, parsedFilter)
  },
})
