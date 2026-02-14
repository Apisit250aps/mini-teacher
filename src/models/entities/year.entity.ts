import { zodDate, zodTimestamp, zodUuid } from '@/lib/zod/fields'
import z from 'zod'

export const BaseYearSchema = z.object({
  id: zodUuid(),
  user: z.uuid(),
  year: z.number().min(2000).max(2600),
  term: z.number().min(1).max(3),
  isActive: z.boolean().default(true),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})
export const CreateYearSchema = BaseYearSchema.extend({
  createdAt: zodTimestamp(),
})
export const UpdateYearSchema = BaseYearSchema.omit({
  id: true,
  createdAt: true,
}).partial()
export type Year = z.infer<typeof BaseYearSchema>
export type CreateYear = z.infer<typeof CreateYearSchema>
export type UpdateYear = z.infer<typeof UpdateYearSchema>
