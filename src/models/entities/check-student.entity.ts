import z from 'zod'
import {
  zodModel,
  zodTimestamp,
  zodUuid,
} from '@/lib/zod/fields'

const checkEnum = ['PRESENT', 'ABSENT', 'LATE', 'LEAVE'] as const

const checkEnumSchema = z.enum(checkEnum).nullable().default(null)

export const BaseCheckStudent = zodModel({
  checkDateId: zodUuid(),
  studentId: zodUuid(),
  status: checkEnumSchema,
})

export const CreateCheckStudentSchema = BaseCheckStudent.extend({
  createdAt: zodTimestamp(),
  updatedAt: zodTimestamp(),
})

export const UpdateCheckStudentSchema = BaseCheckStudent.partial()