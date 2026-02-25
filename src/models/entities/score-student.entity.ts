import { zodModel, zodTimestamp, zodUuid } from '@/lib/zod/fields'
import z from 'zod'
import { BaseStudentSchema } from './student.entity'

export const BaseScoreStudent = zodModel({
  scoreAssignId: zodUuid(),
  studentId: zodUuid(),
  score: z.number().min(0).default(0),
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
