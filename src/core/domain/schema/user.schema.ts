import z from 'zod'
import {
  dateSchema,
  ensureAtLeastOneField,
  optionalNullableStringSchema,
  uuidSchema,
} from './common'

export const userEntitySchema = z.object({
  id: uuidSchema,
  name: optionalNullableStringSchema,
  password: optionalNullableStringSchema,
  email: z.email('รูปแบบอีเมลไม่ถูกต้อง').nullable().optional(),
  emailVerified: dateSchema.nullable().optional(),
  image: optionalNullableStringSchema,
  isActive: z.boolean(),
  isTeacher: z.boolean(),
  isAdmin: z.boolean(),
  firstName: optionalNullableStringSchema,
  lastName: optionalNullableStringSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const userCreateSchema = userEntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const userUpdateSchema = userCreateSchema
  .partial()
  .refine(ensureAtLeastOneField, {
    message: 'ต้องมีข้อมูลอย่างน้อย 1 ฟิลด์',
  })
