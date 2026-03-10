'use client'
import React, { useEffect } from 'react'

import { StudentCreateData } from '@/core/domain/data'
import { studentCreateSchema } from '@/core/domain/schema'
import { useYearContext } from '@/hooks/app/use-year'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/presentations/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/presentations/components/ui/form'
import { Input } from '@/presentations/components/ui/input'

export default function StudentForm({
  value,
  onSubmit,
}: FormValueProps<StudentCreateData>) {
  const { teacher } = useYearContext()
  const methods = useForm<StudentCreateData>({
    resolver: zodResolver(studentCreateSchema),
    defaultValues: {
      teacherId: value?.teacherId ?? teacher,
      code: value?.code ?? '',
      prefix: value?.prefix ?? '',
      firstName: value?.firstName ?? '',
      lastName: value?.lastName ?? '',
      nickname: value?.nickname ?? '',
    },
  })

  useEffect(() => {
    if (!value?.teacherId && teacher) {
      methods.setValue('teacherId', teacher)
    }
  }, [methods, teacher, value?.teacherId])

  return (
    <Form {...methods}>
      <form className="grid gap-4" onSubmit={methods.handleSubmit(onSubmit)}>
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
        <FormField
          control={methods.control}
          name="prefix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>คำนำหน้า</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder="เช่น เด็กชาย, เด็กหญิง"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อ</FormLabel>
              <FormControl>
                <Input {...field} placeholder="กรอกชื่อนักเรียน" />
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
                <Input {...field} placeholder="กรอกนามสกุลนักเรียน" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อเล่น</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder="กรอกชื่อเล่น"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button>{value ? 'บันทึกการแก้ไข' : 'เพิ่มนักเรียน'}</Button>
        </div>
      </form>
    </Form>
  )
}
