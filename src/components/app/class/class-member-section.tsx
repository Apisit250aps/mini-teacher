'use client'
import { useGetClassMembers } from '@/hooks/queries/use-class'
import React from 'react'

export default function ClassMemberSection({ classId }: { classId: string }) {
  const { data } = useGetClassMembers(classId)
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
