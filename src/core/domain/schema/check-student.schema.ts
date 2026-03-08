import z from 'zod'
import { ensureAtLeastOneField, querySchema, uuidSchema } from './common'
import { checkStatusSchema } from './enums'

export const checkStudentEntitySchema = z.object({
  id: uuidSchema,
  checkDateId: uuidSchema,
  studentId: uuidSchema,
  status: checkStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const checkStudentCreateSchema = checkStudentEntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const checkStudentUpdateSchema = z
  .object({
    status: checkStatusSchema.optional(),
  })
  .refine(ensureAtLeastOneField, {
    message: 'ต้องมีข้อมูลอย่างน้อย 1 ฟิลด์',
  })

export const checkStudentQuerySchema = querySchema
