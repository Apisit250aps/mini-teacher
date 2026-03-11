'use client'
import ClassSummary from '@/presentations/components/app/class-summary'
import { useClassContext } from '@/hooks/app/use-class'
import { useParams } from 'next/navigation'
import React from 'react'

export default function ClassSummaryView() {
  const params = useParams<{ classId: string }>()
  const { classes } = useClassContext()
  const activeClass = classes.find((c) => c.id === params.classId)

  return (
    <div>
      <ClassSummary
        classId={params.classId}
        className={activeClass?.name}
        subject={activeClass?.subject}
      />
    </div>
  )
}
