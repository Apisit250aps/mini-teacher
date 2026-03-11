'use client'
import ClassSummary from '@/presentations/components/app/class-summary'
import { useParams } from 'next/navigation'
import React from 'react'

export default function ClassSummaryView() {
  const params = useParams<{ classId: string }>()
  return (
    <div>
      <ClassSummary classId={params.classId} />
    </div>
  )
}
