'use client'
import React from 'react'
import MDEditor from '@uiw/react-md-editor'

type MarkdownViewerProps = {
  content: string
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div data-color-mode="light">
      <MDEditor.Markdown source={content} className="!bg-transparent" />
    </div>
  )
}
