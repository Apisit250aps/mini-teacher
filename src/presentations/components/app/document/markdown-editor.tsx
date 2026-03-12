'use client'
import React from 'react'
import MDEditor from '@uiw/react-md-editor'
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
        data-color-mode="light"
      >
        <MDEditor.Markdown source={value} />
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)} data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange?.(val ?? '')}
        height={parseInt(minHeight) || 400}
        preview="live"
      />
    </div>
  )
}
