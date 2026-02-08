import z from 'zod'
import {
  zodDate,
  zodEmail,
  zodName,
  zodTimestamp,
  zodUuid,
} from '@/lib/zod/fields'

export const BaseUserSchema = z.object({
  id: zodUuid(),
  name: zodName(),
  password: z.string().min(8),
  isActive: z.boolean().default(true),
  isTeacher: z.boolean().default(false),
  firstName: zodName().optional(),
  lastName: zodName().optional(),
  email: zodEmail().optional(),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export const CreateUserSchema = BaseUserSchema.extend({
  createdAt: zodTimestamp(),
})

export const UpdateUserSchema = BaseUserSchema.partial()

export type User = z.infer<typeof BaseUserSchema>
