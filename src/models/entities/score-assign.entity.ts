import z from 'zod'
import { zodAutoUuid, zodDate, zodTimestamp, zodUuid } from '@/lib/zod/fields'
import { ScoreStudentDetailSchema } from './score-student.entity'

export const assignEnum = ['ASSIGNMENT', 'EXAM', 'QUIZ'] as const

export const BaseScoreAssign = z.object({
  id: zodAutoUuid(),
  classId: zodUuid(),
  isEditable: z.boolean().default(true),
  name: z.string(),
  description: z.string().optional().nullable().default(null),
  minScore: z.number().min(0).default(0),
  maxScore: z.number().min(0).default(100),
  type: z.enum(assignEnum).default('ASSIGNMENT'),
  assignDate: z.date().nullable().default(null),
  finalDate: z.date().nullable().default(null),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export const ScoreAssignDetailSchema = BaseScoreAssign.extend({
  scores: z.array(ScoreStudentDetailSchema),
})

export const CreateScoreAssignSchema = BaseScoreAssign.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: zodTimestamp(),
  updatedAt: zodTimestamp(),
})

export type ScoreAssign = z.infer<typeof BaseScoreAssign>
export type ScoreAssignDetail = z.infer<typeof ScoreAssignDetailSchema>
export type CreateScoreAssign = z.infer<typeof CreateScoreAssignSchema>
export type AssignType = z.infer<typeof BaseScoreAssign.shape.type>
