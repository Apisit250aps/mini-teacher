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
  name: zodName().min(4, 'ชื่อต้องมีความยาวอย่างน้อย 4 ตัวอักษร'),
  password: z.string().min(8, 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร'),
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

export const UpdateUserSchema = BaseUserSchema.omit({
  id: true,
  createdAt: true,
})
  .extend({
    password: z
      .string()
      .min(8, 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
      .or(z.literal('')),
  })
  .partial()

export type User = z.infer<typeof BaseUserSchema>
