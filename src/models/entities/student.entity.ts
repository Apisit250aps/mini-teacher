import { zodDate, zodTimestamp, zodUuid } from '@/lib/zod/fields'
import z from 'zod'

export const BaseStudentSchema = z.object({
  id: zodUuid(),
  code: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  nickname: z.string().optional(),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export const CreateStudentSchema = BaseStudentSchema.pick({
  code: true,
  firstName: true,
  lastName: true,
  nickname: true,
}).partial({ nickname: true })

export const UpdateStudentSchema = CreateStudentSchema.partial()

export type Student = z.infer<typeof BaseStudentSchema>
export type CreateStudent = z.infer<typeof CreateStudentSchema>
export type UpdateStudent = z.infer<typeof UpdateStudentSchema>