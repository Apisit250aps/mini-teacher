import z from 'zod'
import {
  dateSchema,
  ensureAtLeastOneField,
  optionalNullableStringSchema,
  querySchema,
  uuidSchema,
} from './common'

export const checkDateEntitySchema = z.object({
  id: uuidSchema,
  classId: uuidSchema,
  date: dateSchema,
  description: optionalNullableStringSchema,
  isEditable: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const checkDateCreateSchema = checkDateEntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const checkDateUpdateSchema = checkDateCreateSchema
  .omit({ classId: true })
  .partial()
  .refine(ensureAtLeastOneField, {
    message: 'ต้องมีข้อมูลอย่างน้อย 1 ฟิลด์',
  })

export const checkDateQuerySchema = querySchema
