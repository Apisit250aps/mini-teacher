import z from 'zod'
import { zodAutoUuid, zodDate, zodTimestamp, zodUuid } from '@/lib/zod/fields'

const checkEnum = ['PRESENT', 'ABSENT', 'LATE', 'LEAVE'] as const

const checkEnumSchema = z.enum(checkEnum).nullable().default(null)

export const BaseCheckStudent = z.object({
  id: zodAutoUuid(),
  checkDateId: zodUuid(),
  studentId: zodUuid(),
  status: checkEnumSchema,
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export const CreateCheckStudentSchema = BaseCheckStudent.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: zodTimestamp(),
  updatedAt: zodTimestamp(),
})