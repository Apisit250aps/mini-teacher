'use client'
import React from 'react'

import { ClassCreateData } from '@/core/domain/data'
import { classCreateSchema } from '@/core/domain/schema'
import { useYearContext } from '@/hooks/app/use-year'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/presentations/components/ui/form'
import { Input } from '@/presentations/components/ui/input'
import { Textarea } from '@/presentations/components/ui/textarea'
import { Button } from '@/presentations/components/ui/button'

export default function ClassForm({
  value,
  onSubmit,
}: FormValueProps<ClassCreateData>) {
  const { active } = useYearContext()
  const methods = useForm({
    resolver: zodResolver(classCreateSchema),
    defaultValues: {
      name: value?.name ?? '',
      subject: value?.subject ?? '',
      description: value?.description ?? '',
      isActive: value?.isActive ?? true,
      yearId: active?.id,
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
              <FormLabel>ชื่อชั้นเรียน</FormLabel>
              <FormControl>
                <Input {...field} placeholder="กรอกชื่อชั้นเรียน" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อวิชา</FormLabel>
              <FormControl>
                <Input {...field} placeholder="กรอกชื่อวิชา" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>คำอธิบาย</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  placeholder="กรอกคำอธิบาย"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button>{value ? 'บันทึกการแก้ไข' : 'สร้างชั้นเรียน'}</Button>
        </div>
      </form>
    </Form>
  )
}
