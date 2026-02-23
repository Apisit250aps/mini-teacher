import { zodAutoUuid, zodDate, zodTimestamp, zodUuid } from '@/lib/zod/fields'
import z from 'zod'
import { BaseStudentSchema } from './student.entity'

export const BaseScoreStudent = z.object({
  id: zodAutoUuid(),
  scoreAssignId: zodUuid(),
  studentId: zodUuid(),
  score: z.number().min(0).default(0),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export const ScoreStudentDetailSchema = BaseScoreStudent.extend({
  student: BaseStudentSchema,
})

export const CreateScoreStudentSchema = BaseScoreStudent.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: zodTimestamp(),
  updatedAt: zodTimestamp(),
})
