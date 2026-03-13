'use client'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/presentations/components/ui/form'
import { Input } from '@/presentations/components/ui/input'
import { Button } from '@/presentations/components/ui/button'
import { Checkbox } from '@/presentations/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentations/components/ui/select'
import MarkdownEditor from '../markdown-editor'
import type { Document } from '@/core/domain/entities'

const documentFormSchema = z.object({
  type: z.enum(['TOS', 'PRIVACY_POLICY']),
  version: z.string().trim().min(1, 'กรุณาระบุเวอร์ชัน เช่น 1.0.0'),
  content: z.string().min(1, 'กรุณาระบุเนื้อหาเอกสาร'),
  language: z.enum(['TH', 'EN']),
  isActive: z.boolean(),
})

export type DocumentFormData = z.infer<typeof documentFormSchema>

const DOCUMENT_TYPE_LABELS = {
  TOS: 'ข้อกำหนดการใช้งาน (Terms of Service)',
  PRIVACY_POLICY: 'นโยบายความเป็นส่วนตัว (Privacy Policy)',
} as const

type DocumentFormProps = {
  value?: Partial<Document>
  lockType?: boolean
  onSubmit: (data: DocumentFormData) => void
}

export default function DocumentForm({
  value,
  lockType = false,
  onSubmit,
}: DocumentFormProps) {
  const methods = useForm<DocumentFormData>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      type: (value?.type as 'TOS' | 'PRIVACY_POLICY') ?? 'TOS',
      version: value?.version ?? '',
      content: value?.content ?? '',
      language: (value?.language as 'TH' | 'EN') ?? 'TH',
      isActive: value?.isActive ?? true,
    },
  })

  return (
    <Form {...methods}>
      <form
        className="flex flex-col gap-4 max-h-[70vh] overflow-hidden"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4 overflow-y-auto pr-1 flex-1">
          <FormField
            control={methods.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ประเภทเอกสาร</FormLabel>
                <Select
                  disabled={lockType}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภทเอกสาร" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(DOCUMENT_TYPE_LABELS).map(
                      ([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>เวอร์ชัน</FormLabel>
                <FormControl>
                  <Input placeholder="เช่น 1.0.0 หรือ 2024.03" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ภาษา</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกภาษา" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TH">ภาษาไทย (TH)</SelectItem>
                    <SelectItem value="EN">English (EN)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={methods.control}
            name="content"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>เนื้อหาเอกสาร (Markdown)</FormLabel>
                <MarkdownEditor
                  value={field.value}
                  onChange={field.onChange}
                  minHeight="320px"
                />
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>เปิดใช้งาน</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end shrink-0 pt-2 border-t">
          <Button type="submit">บันทึก</Button>
        </div>
      </form>
    </Form>
  )
}
