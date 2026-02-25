import { zodTimestamp, zodUuid, zodModel } from '@/lib/zod/fields'

export const BaseClassMemberSchema = zodModel({
  classId: zodUuid(),
  studentId: zodUuid(),
})

export const ClassMemberSchema = BaseClassMemberSchema.extend({
  createdAt: zodTimestamp(),
  updatedAt: zodTimestamp(),
})
