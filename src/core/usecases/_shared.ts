import z from 'zod'
import { AppError } from '@/lib/utils/error'
import { uuidSchema } from '@/core/domain/schema/common'

export const parseOrThrow = <T>(schema: z.ZodType<T>, payload: unknown): T => {
  const result = schema.safeParse(payload)
  if (!result.success) {
    throw new AppError(
      result.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง',
      'VALIDATE_ERROR',
    )
  }
  return result.data
}

export const parseUuidOrThrow = (value: unknown, fieldName = 'id'): string => {
  const parsed = parseOrThrow(uuidSchema, value)
  if (!parsed) {
    throw new AppError(`รูปแบบ ${fieldName} ไม่ถูกต้อง`, 'VALIDATE_ERROR')
  }
  return parsed
}

export const ensureFoundOrThrow = <T>(
  value: T | null,
  message = 'ไม่พบข้อมูล',
): T => {
  if (!value) {
    throw new AppError(message, 'NOT_FOUND')
  }
  return value
}
