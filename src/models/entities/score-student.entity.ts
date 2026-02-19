import { zodAutoUuid, zodDate, zodTimestamp, zodUuid } from '@/lib/zod/fields'
import z from 'zod'

export const BaseScoreStudent = z.object({
  id: zodAutoUuid(),
  scoreAssignId: zodUuid(),
  studentId: zodUuid(),
  score: z.number().min(0).default(0),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export const CreateScoreStudentSchema = BaseScoreStudent.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: zodTimestamp(),
  updatedAt: zodTimestamp(),
})

export type ScoreStudent = z.infer<typeof BaseScoreStudent>
export type CreateScoreStudent = z.infer<typeof CreateScoreStudentSchema>