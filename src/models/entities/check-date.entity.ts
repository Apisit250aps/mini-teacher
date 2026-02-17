import {
  zodAutoUuid,
  zodDate,
  zodLocaleDateString,
  zodTimestamp,
  zodUuid,
} from '@/lib/zod/fields'
import z from 'zod'

export const BaseCheckDate = z.object({
  id: zodAutoUuid(),
  classId: zodUuid(),
  isEditable: z.boolean().default(true),
  date: zodLocaleDateString(),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export const CreateCheckDateSchema = BaseCheckDate.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: zodTimestamp(),
  updatedAt: zodTimestamp(),
})

export type CheckDate = z.infer<typeof BaseCheckDate>
export type CreateCheckDate = z.infer<typeof CreateCheckDateSchema>
