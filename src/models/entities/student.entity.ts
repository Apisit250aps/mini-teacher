import { zodDate, zodTimestamp, zodUuid } from '@/lib/zod/fields'
import z from 'zod'

export const BaseStudentSchema = z.object({
  id: zodUuid(),
  teacher: z.uuid(),
  code: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  nickname: z.string().optional(),
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
export type Student = z.infer<typeof BaseStudentSchema>
export type CreateStudent = z.infer<typeof CreateStudentSchema>
export type UpdateStudent = z.infer<typeof UpdateStudentSchema>