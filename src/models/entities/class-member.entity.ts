import { zodDate, zodTimestamp, zodAutoUuid, zodUuid } from '@/lib/zod/fields'
import z from 'zod'
import { BaseStudentSchema } from '@/models/entities'

export const BaseClassMemberSchema = z.object({
  id: zodAutoUuid(),
  classId: zodUuid(),
  studentId: zodUuid(),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export const ClassMemberSchema = BaseClassMemberSchema.extend({
  createdAt: zodTimestamp(),
  updatedAt: zodTimestamp(),
})

export const ClassMemberDetailSchema = BaseClassMemberSchema.extend({
  student: BaseStudentSchema,
})
