import React from 'react'
import { getClassMembersByClassId } from '@/models/repositories/class-member.repo'
import ClassDetailView from '@/views/class-detail-view'
import { getClassById } from '@/models/repositories'
import { ClassProvider } from '@/hooks/app/use-class'

export default async function Page({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params

  const classRoom = await getClassById(classId)
  if (!classRoom) {
    return <div>ไม่พบห้องเรียน</div>
  }
  return (
    <ClassProvider classActive={classRoom}>
      <ClassDetailView classRoom={classRoom} />
    </ClassProvider>
  )
}
