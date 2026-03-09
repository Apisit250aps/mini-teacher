import z from 'zod'

export const uuidSchema = z.uuid('รูปแบบ id ไม่ถูกต้อง')

export const dateSchema = z.coerce.date({
  error: 'รูปแบบวันที่ไม่ถูกต้อง',
})

export const optionalNullableStringSchema = z
  .string()
  .trim()
  .nullable()
  .optional()

export const querySchema = z.object({
  where: z.record(z.string(), z.unknown()).optional(),
  orderBy: z
    .record(z.string(), z.enum(['asc', 'desc']))
    .or(z.array(z.record(z.string(), z.enum(['asc', 'desc']))))
    .optional(),
  skip: z.number().int().min(0).optional(),
  take: z.number().int().min(1).optional(),
})

export const ensureAtLeastOneField = <T extends Record<string, unknown>>(
  value: T,
): boolean => Object.values(value).some((item) => item !== undefined)
