import z from 'zod'
import { dateSchema, ensureAtLeastOneField, uuidSchema } from './common'

export const verificationTokenEntitySchema = z.object({
  id: uuidSchema,
  identifier: z.string().trim().min(1),
  token: z.string().trim().min(1),
  expires: dateSchema,
})

export const verificationTokenCreateSchema = verificationTokenEntitySchema.omit(
  { id: true },
)

export const verificationTokenUpdateSchema = verificationTokenCreateSchema
  .partial()
  .refine(ensureAtLeastOneField, {
    message: 'ต้องมีข้อมูลอย่างน้อย 1 ฟิลด์',
  })
