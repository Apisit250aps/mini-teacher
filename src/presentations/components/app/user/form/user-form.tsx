'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/presentations/components/ui/form'
import { Input } from '@/presentations/components/ui/input'
import { Checkbox } from '@/presentations/components/ui/checkbox'
import { Button } from '@/presentations/components/ui/button'
import { User } from '@/core/domain/entities'

const userFormSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อบัญชี'),
  email: z.email('รูปแบบอีเมลไม่ถูกต้อง').nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  isActive: z.boolean(),
  isTeacher: z.boolean(),
  isAdmin: z.boolean(),
})

export type UserFormData = z.infer<typeof userFormSchema>

type UserFormProps = {
  value?: Partial<User>
  onSubmit: (data: UserFormData) => void
}

const statusFields: {
  name: 'isActive' | 'isTeacher' | 'isAdmin'
  label: string
  description: string
}[] = [
  {
    name: 'isActive',
    label: 'เปิดใช้งาน',
    description: 'อนุญาตให้ผู้ใช้เข้าสู่ระบบได้',
  },
  {
    name: 'isTeacher',
    label: 'ครูผู้สอน',
    description: 'ผู้ใช้มีสิทธิ์จัดการห้องเรียน',
  },
  {
    name: 'isAdmin',
    label: 'ผู้ดูแลระบบ',
    description: 'ผู้ใช้มีสิทธิ์เต็มในการจัดการระบบ',
  },
]

export default function UserForm({ value, onSubmit }: UserFormProps) {
  const methods = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: value?.name ?? '',
      email: value?.email ?? null,
      firstName: value?.firstName ?? null,
      lastName: value?.lastName ?? null,
      isActive: value?.isActive ?? true,
      isTeacher: value?.isTeacher ?? false,
      isAdmin: value?.isAdmin ?? false,
    },
  })

  return (
    <Form {...methods}>
      <form className="grid gap-4" onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField
          control={methods.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อบัญชี</FormLabel>
              <FormControl>
                <Input {...field} placeholder="กรอกชื่อบัญชี" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>อีเมล</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  type="email"
                  placeholder="กรอกอีเมล"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={methods.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อ</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="กรอกชื่อ"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>นามสกุล</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="กรอกนามสกุล"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          {statusFields.map(({ name, label, description }) => (
            <FormField
              key={name}
              control={methods.control}
              name={name}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">{label}</FormLabel>
                    <FormDescription className="text-xs">
                      {description}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button type="submit" className="w-full">
          {value ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้'}
        </Button>
      </form>
    </Form>
  )
}
