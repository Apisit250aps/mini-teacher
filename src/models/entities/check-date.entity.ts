import {
  zodLocaleDateString,
  zodModel,
  zodTimestamp,
  zodUuid,
} from '@/lib/zod/fields'
import z from 'zod'

export const BaseCheckDate = zodModel({
  classId: zodUuid(),
  isEditable: z.boolean().default(true),
  date: zodLocaleDateString(),
})

export const CreateCheckDateSchema = BaseCheckDate.extend({
  createdAt: zodTimestamp(),
})
