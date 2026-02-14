import { zodDate, zodTimestamp, zodUuid } from '@/lib/zod/fields'
import z from 'zod'
import { BaseStudentSchema } from './student.entity'

export const BaseClassMemberSchema = z.object({
  id: zodUuid(),
  classId: z.uuid(),
  studentId: z.uuid(),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export const ClassMemberSchema = BaseClassMemberSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: zodTimestamp(),
  updatedAt: zodTimestamp(),
})

export const ClassMemberDetailSchema = BaseClassMemberSchema.extend({
  student: BaseStudentSchema,
})

export type ClassMember = z.infer<typeof BaseClassMemberSchema>
export type ClassMemberDetail = z.infer<typeof ClassMemberDetailSchema>
export type ClassMemberCreateInput = z.infer<typeof ClassMemberSchema>
