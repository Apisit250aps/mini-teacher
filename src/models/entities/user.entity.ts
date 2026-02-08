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
  password: z.string(),
  isActive: z.boolean().default(true),
  isTeacher: z.boolean().default(false),
  firstName: zodName(),
  lastName: zodName(),
  email: zodEmail(),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export type User = z.infer<typeof BaseUserSchema>
