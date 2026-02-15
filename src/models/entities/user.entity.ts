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
  isTeacher: z.boolean().default(true),
  firstName: zodName().optional(),
  lastName: zodName().optional(),
  email: zodEmail().optional(),
  lastLoginAt: zodDate().optional(),
  createdAt: zodDate(),
  updatedAt: zodTimestamp(),
})

export const CreateUserSchema = BaseUserSchema.extend({
  createdAt: zodTimestamp(),
})

export const AuthUpdateUser = BaseUserSchema.pick({
  id: true,
  name: true,
  isActive: true,
  isTeacher: true,
  email: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string(),
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

export const UserLoginSchema = BaseUserSchema.pick({
  name: true,
  password: true,
})

export type User = z.infer<typeof BaseUserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type UserLogin = z.infer<typeof UserLoginSchema>
