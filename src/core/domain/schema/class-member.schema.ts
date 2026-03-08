import z from 'zod'
import { querySchema, uuidSchema } from './common'

export const classMemberEntitySchema = z.object({
  id: uuidSchema,
  classId: uuidSchema,
  studentId: uuidSchema,
  userId: uuidSchema.nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const classMemberCreateSchema = classMemberEntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const classMemberQuerySchema = querySchema
