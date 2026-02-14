'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { StudentFormSchema, StudentFormValue } from '@/models/entities'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

export default function StudentForm({
  value,
  onSubmit,
}: FormValueProps<StudentFormValue>) {
  const methods = useForm<StudentFormValue>({
    resolver: zodResolver(StudentFormSchema),
    defaultValues: {
      firstName: value?.firstName || '',
      lastName: value?.lastName || '',
      nickname: value?.nickname || '',
      code: value?.code || '',
    },
  })
  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={methods.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รหัสนักเรียน</FormLabel>
              <FormControl>
                <Input {...field} placeholder="กรอกรหัสนักเรียน" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={methods.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อ</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="กรอกชื่อ" />
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
                  <Input {...field} placeholder="กรอกนามสกุล" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={methods.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อเล่น</FormLabel>
              <FormControl>
                <Input {...field} placeholder="กรอกชื่อเล่น" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button>{value ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างนักเรียน'}</Button>
        </div>
      </form>
    </Form>
  )
}
