import z from 'zod'
import {
  ensureAtLeastOneField,
  optionalNullableStringSchema,
  querySchema,
  uuidSchema,
} from './common'

export const studentEntitySchema = z.object({
  id: uuidSchema,
  teacherId: uuidSchema,
  code: z.string().trim().min(1),
  prefix: optionalNullableStringSchema,
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  nickname: optionalNullableStringSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const studentCreateSchema = studentEntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const studentUpdateSchema = studentCreateSchema
  .omit({ teacherId: true })
  .partial()
  .refine(ensureAtLeastOneField, {
    message: 'ต้องมีข้อมูลอย่างน้อย 1 ฟิลด์',
  })

export const studentQuerySchema = querySchema
