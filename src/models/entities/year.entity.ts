import { zodTimestamp, zodUuid, zodModel } from '@/lib/zod/fields'
import z from 'zod'

export const BaseYearSchema = zodModel({
  user: zodUuid(),
  year: z.number().min(2000).max(2600),
  term: z.number().min(1).max(3),
  isActive: z.boolean().default(true),
})

export const CreateYearSchema = BaseYearSchema.extend({
  createdAt: zodTimestamp(),
})
export const UpdateYearSchema = BaseYearSchema.omit({
  id: true,
  createdAt: true,
}).partial()
