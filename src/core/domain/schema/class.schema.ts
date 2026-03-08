import z from 'zod'
import {
  ensureAtLeastOneField,
  optionalNullableStringSchema,
  querySchema,
  uuidSchema,
} from './common'

export const classEntitySchema = z.object({
  id: uuidSchema,
  yearId: uuidSchema,
  name: z.string().trim().min(1),
  subject: z.string().trim().min(1),
  description: optionalNullableStringSchema,
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const classCreateSchema = classEntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const classUpdateSchema = classCreateSchema
  .partial()
  .refine(ensureAtLeastOneField, {
    message: 'ต้องมีข้อมูลอย่างน้อย 1 ฟิลด์',
  })

export const classQuerySchema = querySchema
