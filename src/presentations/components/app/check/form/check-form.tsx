'use client'
import React from 'react'

import { checkDateCreateSchema } from '@/core/domain/schema'
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
import { Input } from '@/presentations/components/ui/input-password'
import { Textarea } from '@/presentations/components/ui/textarea'
import { CheckDateCreateData, CheckDateUpdateData } from '@/core/domain/data'
import { Button } from '@/presentations/components/ui/button'

export default function CheckForm({
  value,
  onSubmit,
}: FormValueProps<CheckDateCreateData | CheckDateUpdateData>) {
  const methods = useForm({
    resolver: zodResolver(checkDateCreateSchema),
    defaultValues: {
      classId: value?.classId || '',
      date: new Date(value?.date ?? new Date()).toISOString().split('T')[0],
      description: value?.description ?? '',
      isEditable: value?.isEditable ?? true,
    },
  })
  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={methods.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>วันที่</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  placeholder="กรอกวันที่"
                  value={field.value as string}
                />
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
                <Textarea {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">{value ? 'บันทึกการแก้ไข' : 'สร้าง'}</Button>
        </div>
      </form>
    </Form>
  )
}
