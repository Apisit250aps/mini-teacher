import z from 'zod'
import { zodModel, zodTimestamp, zodUuid } from '@/lib/zod/fields'

export const assignEnum = ['ASSIGNMENT', 'EXAM', 'QUIZ'] as const

export const BaseScoreAssign = zodModel({
  classId: zodUuid(),
  isEditable: z.boolean().default(true),
  name: z.string(),
  description: z.string().optional().nullable().default(null),
  minScore: z.number().min(0).default(0),
  maxScore: z.number().min(0).default(100),
  type: z.enum(assignEnum).default('ASSIGNMENT'),
  assignDate: z.date().nullable().default(null),
  finalDate: z.date().nullable().default(null),
})

export const CreateScoreAssignSchema = BaseScoreAssign.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: zodTimestamp(),
  updatedAt: zodTimestamp(),
})

export const UpdateScoreAssignSchema = CreateScoreAssignSchema.partial()
