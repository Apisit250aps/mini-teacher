import z from 'zod'
import { dateSchema, ensureAtLeastOneField, uuidSchema } from './common'

export const sessionEntitySchema = z.object({
  id: uuidSchema,
  sessionToken: z.string().trim().min(1),
  userId: uuidSchema,
  expires: dateSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const sessionCreateSchema = sessionEntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const sessionUpdateSchema = sessionCreateSchema
  .partial()
  .refine(ensureAtLeastOneField, {
    message: 'ต้องมีข้อมูลอย่างน้อย 1 ฟิลด์',
  })
