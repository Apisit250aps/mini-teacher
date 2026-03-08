import z from 'zod'
import {
  ensureAtLeastOneField,
  optionalNullableStringSchema,
  uuidSchema,
} from './common'

export const accountEntitySchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  type: z.string().min(1),
  provider: z.string().min(1),
  providerAccountId: z.string().min(1),
  refresh_token: optionalNullableStringSchema,
  access_token: optionalNullableStringSchema,
  expires_at: z.number().int().nullable().optional(),
  token_type: optionalNullableStringSchema,
  scope: optionalNullableStringSchema,
  id_token: optionalNullableStringSchema,
  session_state: optionalNullableStringSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const accountCreateSchema = accountEntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const accountUpdateSchema = accountCreateSchema
  .partial()
  .refine(ensureAtLeastOneField, {
    message: 'ต้องมีข้อมูลอย่างน้อย 1 ฟิลด์',
  })
