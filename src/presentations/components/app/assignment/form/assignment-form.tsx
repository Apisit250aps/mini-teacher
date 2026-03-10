'use client'

import React from 'react'
import z from 'zod'
import { assignmentCreateSchema } from '@/core/domain/schema'
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
import { Button } from '@/presentations/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentations/components/ui/select'
import {
  ScoreAssignCreateData,
  ScoreAssignUpdateData,
} from '@/core/domain/data'

const ASSIGN_TYPE_OPTIONS = [
  { value: 'ASSIGNMENT', label: 'งานมอบหมาย' },
  { value: 'HOMEWORK', label: 'การบ้าน' },
  { value: 'QUIZ', label: 'ทดสอบย่อย' },
  { value: 'EXAM', label: 'สอบ' },
  { value: 'PROJECT', label: 'โปรเจค' },
]

// Override date fields to accept string input from <input type="date">
const formSchema = assignmentCreateSchema
  .omit({ assignDate: true, dueDate: true })
  .extend({
    assignDate: z.string().nullable().optional(),
    dueDate: z.string().nullable().optional(),
  })

type FormValues = z.infer<typeof formSchema>

export default function AssignmentForm({
  value,
  onSubmit,
}: FormValueProps<ScoreAssignCreateData | ScoreAssignUpdateData>) {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: (value as Partial<ScoreAssignCreateData>)?.classId || '',
      title: value?.title ?? '',
      description: value?.description ?? '',
      minScore: value?.minScore ?? 0,
      maxScore: value?.maxScore ?? 100,
      type: value?.type ?? 'ASSIGNMENT',
      assignDate: value?.assignDate
        ? new Date(value.assignDate).toISOString().split('T')[0]
        : '',
      dueDate: value?.dueDate
        ? new Date(value.dueDate).toISOString().split('T')[0]
        : '',
      isEditable: value?.isEditable ?? true,
    },
  })

  const handleSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      assignDate: (data.assignDate || null) as Date | null,
      dueDate: (data.dueDate || null) as Date | null,
      description: data.description || null,
    })
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="grid gap-4"
      >
        <FormField
          control={methods.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่องาน/ข้อสอบ</FormLabel>
              <FormControl>
                <Input {...field} placeholder="กรอกชื่อ" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ประเภท</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภท" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ASSIGN_TYPE_OPTIONS.map(({ value: v, label }) => (
                    <SelectItem key={v} value={v}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={methods.control}
            name="minScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>คะแนนต่ำสุด</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value as number}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="maxScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>คะแนนสูงสุด</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value as number}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={methods.control}
            name="assignDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันที่มอบหมาย</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={(field.value as string) ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันส่ง</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={(field.value as string) ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
          <Button type="submit">
            {value?.title ? 'บันทึกการแก้ไข' : 'สร้าง'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
