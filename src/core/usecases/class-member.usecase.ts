import type {
  ClassMemberCreateData,
  ClassMemberQuery,
} from '@/core/domain/data/class-member'
import type { ClassMemberRepository } from '@/core/domain/repositories/class-member'
import type { ClassMemberUseCase } from '@/core/domain/usecases/class-member'
import {
  classMemberCreateSchema,
  classMemberQuerySchema,
} from '@/core/domain/schema/class-member.schema'
import { AppError } from '@/lib/utils/error'
import { parseOrThrow, parseUuidOrThrow } from './_shared'

export const createClassMemberUseCase = (
  repository: ClassMemberRepository,
): ClassMemberUseCase => ({
  create: async (data) => {
    const payload = parseOrThrow<ClassMemberCreateData>(
      classMemberCreateSchema,
      data,
    )
    const existed = await repository.getUnique(
      payload.classId,
      payload.studentId,
    )
    if (existed) {
      throw new AppError(
        'นักเรียนคนนี้เป็นสมาชิกห้องเรียนอยู่แล้ว',
        'DATA_EXIST',
      )
    }
    return repository.create(payload)
  },

  delete: async (classId, studentId) => {
    const parsedClassId = parseUuidOrThrow(classId, 'classId')
    const parsedStudentId = parseUuidOrThrow(studentId, 'studentId')
    const existed = await repository.getUnique(parsedClassId, parsedStudentId)
    if (!existed) {
      throw new AppError('ไม่พบสมาชิกห้องเรียนที่ต้องการลบ', 'NOT_FOUND')
    }
    await repository.delete(parsedClassId, parsedStudentId)
  },

  getUnique: async (classId, studentId) => {
    const parsedClassId = parseUuidOrThrow(classId, 'classId')
    const parsedStudentId = parseUuidOrThrow(studentId, 'studentId')
    return repository.getUnique(parsedClassId, parsedStudentId)
  },

  getByClassId: async (classId, filter) => {
    const parsedClassId = parseUuidOrThrow(classId, 'classId')
    const parsedFilter = filter
      ? parseOrThrow<ClassMemberQuery>(classMemberQuerySchema, filter)
      : undefined
    return repository.getByClassId(parsedClassId, parsedFilter)
  },
})
