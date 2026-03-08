import z from 'zod'
import { querySchema, uuidSchema } from './common'

export const scoreEntitySchema = z.object({
  id: uuidSchema,
  assignmentId: uuidSchema,
  studentId: uuidSchema,
  score: z.number().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const scoreCreateSchema = scoreEntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const scoreUpdateSchema = z.object({
  score: z.number().min(0),
})

export const scoreQuerySchema = querySchema
