import { zodDate, zodTimestamp, zodAutoUuid, zodUuid } from '@/lib/zod/fields'
import z from 'zod'
import { BaseClassSchema } from './class.entity'

export const BaseYearSchema = z.object({
  id: zodAutoUuid(),
  user: zodUuid(),
  year: z.number().min(2000).max(2600),
  term: z.number().min(1).max(3),
  isActive: z.boolean().default(true),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export const YearDetailSchema = BaseYearSchema.extend({
  classes: z.array(BaseClassSchema),
})

export const CreateYearSchema = BaseYearSchema.extend({
  createdAt: zodTimestamp(),
})
export const UpdateYearSchema = BaseYearSchema.omit({
  id: true,
  createdAt: true,
}).partial()
