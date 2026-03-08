import z from 'zod'
import {
  ensureAtLeastOneField,
  optionalNullableStringSchema,
  querySchema,
  uuidSchema,
} from './common'

export const yearEntitySchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  year: z.number().int().min(1),
  term: z.number().int().min(1),
  description: optionalNullableStringSchema,
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const yearCreateSchema = yearEntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const yearUpdateSchema = yearCreateSchema
  .omit({ userId: true })
  .partial()
  .refine(ensureAtLeastOneField, {
    message: 'ต้องมีข้อมูลอย่างน้อย 1 ฟิลด์',
  })

export const yearQuerySchema = querySchema
