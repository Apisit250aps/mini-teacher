import React from 'react'
import { getClassMembersByClassId } from '@/models/repositories/class-member.repo'

export default async function Page({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params

  const member = await getClassMembersByClassId(classId)
  return (
    <div>
      <pre>
        {JSON.stringify(
          member.map((m) => m.student),
          null,
          2,
        )}
      </pre>
    </div>
  )
}
