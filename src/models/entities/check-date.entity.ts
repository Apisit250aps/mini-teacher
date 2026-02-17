import { zodAutoUuid, zodDate, zodTimestamp, zodUuid } from '@/lib/zod/fields'
import z from 'zod'

export const BaseCheckDate = z.object({
  id: zodAutoUuid(),
  classId: zodUuid(),
  isEditable: z.boolean().default(true),
  date: zodDate(),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export type CheckDate = z.infer<typeof BaseCheckDate>