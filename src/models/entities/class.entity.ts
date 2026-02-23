import { zodDate, zodTimestamp, zodAutoUuid, zodUuid } from '@/lib/zod/fields'
import z from 'zod'

export const BaseClassSchema = z.object({
  id: zodAutoUuid(),
  year: zodUuid(),
  name: z.string().min(1, 'ชื่อห้องเรียนต้องไม่ว่าง'),
  subject: z.string().min(1, 'วิชาต้องไม่ว่าง'),
  description: z.string(),
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

export const ClassFormSchema = CreateClassSchema.omit({
  id: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
})
