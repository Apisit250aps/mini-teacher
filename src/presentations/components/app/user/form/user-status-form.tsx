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
} from '@/presentations/components/ui/form'
import { Checkbox } from '@/presentations/components/ui/checkbox'
import { Button } from '@/presentations/components/ui/button'
import { User } from '@/core/domain/entities'

const userStatusSchema = z.object({
  isAdmin: z.boolean(),
  isActive: z.boolean(),
  isTeacher: z.boolean(),
})

export type UserStatusFormData = z.infer<typeof userStatusSchema>

type UserStatusFormProps = {
  value: User
  onSubmit: (data: UserStatusFormData) => void
}

export default function UserStatusForm({
  value,
  onSubmit,
}: UserStatusFormProps) {
  const methods = useForm<UserStatusFormData>({
    resolver: zodResolver(userStatusSchema),
    defaultValues: {
      isAdmin: value.isAdmin,
      isActive: value.isActive,
      isTeacher: value.isTeacher,
    },
  })

  const fields: {
    name: keyof UserStatusFormData
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

  return (
    <Form {...methods}>
      <form className="grid gap-4" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="space-y-1 pb-2 border-b">
          <p className="text-sm font-medium">
            {value.name ??
              `${value.firstName ?? ''} ${value.lastName ?? ''}`.trim()}
          </p>
          <p className="text-xs text-muted-foreground">{value.email}</p>
        </div>
        {fields.map(({ name, label, description }) => (
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
        <Button type="submit" className="w-full">
          บันทึกการแก้ไข
        </Button>
      </form>
    </Form>
  )
}
