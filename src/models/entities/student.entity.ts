import { zodDate, zodName, zodTimestamp, zodAutoUuid, zodUuid } from '@/lib/zod/fields'
import z from 'zod'

export const BaseStudentSchema = z.object({
  id: zodAutoUuid(),
  teacher: zodUuid(),
  code: z.string(),
  prefix: zodName(),
  firstName: zodName(),
  lastName: zodName(),
  nickname: zodName().optional(),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export const CreateStudentSchema = BaseStudentSchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: zodTimestamp(),
  updatedAt: zodTimestamp(),
})

export const UpdateStudentSchema = CreateStudentSchema.partial()

export const StudentFormSchema = CreateStudentSchema.pick({
  prefix: true,
  code: true,
  firstName: true,
  lastName: true,
  nickname: true,
})
