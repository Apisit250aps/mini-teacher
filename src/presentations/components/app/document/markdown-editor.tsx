'use client'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/presentations/components/ui/tabs'
import { Textarea } from '@/presentations/components/ui/textarea'
import { cn } from '@/lib/utils'

type MarkdownEditorProps = {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  className?: string
  minHeight?: string
}

export default function MarkdownEditor({
  value,
  onChange,
  readOnly = false,
  className,
  minHeight = '400px',
}: MarkdownEditorProps) {
  if (readOnly) {
    return (
      <div
        className={cn(
          'prose prose-sm dark:prose-invert max-w-none overflow-auto rounded-md border p-4',
          className,
        )}
        style={{ minHeight }}
      >
        <ReactMarkdown>{value}</ReactMarkdown>
      </div>
    )
  }

  return (
    <Tabs defaultValue="edit" className={cn('w-full', className)}>
      <TabsList>
        <TabsTrigger value="edit">แก้ไข</TabsTrigger>
        <TabsTrigger value="preview">ดูตัวอย่าง</TabsTrigger>
      </TabsList>

      <TabsContent value="edit">
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="เขียนเนื้อหาเอกสารในรูปแบบ Markdown..."
          className="font-mono text-sm resize-none"
          style={{ minHeight }}
        />
      </TabsContent>

      <TabsContent value="preview">
        <div
          className="prose prose-sm dark:prose-invert max-w-none overflow-auto rounded-md border p-4 bg-background"
          style={{ minHeight }}
        >
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">ยังไม่มีเนื้อหา</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
