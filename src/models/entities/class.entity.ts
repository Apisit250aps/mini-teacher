import { zodDate, zodTimestamp, zodUuid } from '@/lib/zod/fields'
import z from 'zod'

export const BaseClassSchema = z.object({
  id: zodUuid(),
  year: z.uuid(),
  name: z.string().min(1, 'ชื่อห้องเรียนต้องไม่ว่าง'),
  subject: z.string().min(1, 'วิชาต้องไม่ว่าง'),
  isActive: z.boolean().default(true),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export const CreateClassSchema = BaseClassSchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: zodTimestamp(),
  updatedAt: zodTimestamp(),
})

export const UpdateClassSchema = BaseClassSchema.omit({
  id: true,
  createdAt: true,
}).partial()

export type Class = z.infer<typeof BaseClassSchema>
export type CreateClass = z.infer<typeof CreateClassSchema>
export type UpdateClass = z.infer<typeof UpdateClassSchema>
