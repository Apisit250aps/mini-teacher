'use client'

import React, { useCallback } from 'react'

import { CheckDateWithStudents } from '@/core/domain/data'
import { CheckStatus } from '@/core/domain/entities'
import {
  useCheckDatesByClassQuery,
  useCheckStudentMutations,
} from '@/hooks/queries'
import {
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu'
import { useParams } from 'next/navigation'

const STATUS_OPTIONS: { value: CheckStatus; label: string }[] = [
  { value: 'PRESENT', label: 'มา' },
  { value: 'LATE', label: 'สาย' },
  { value: 'ABSENT', label: 'ขาด' },
  { value: 'LEAVE', label: 'ลา' },
]

export default function CheckAllAction({
  checkDate,
}: {
  checkDate: CheckDateWithStudents
}) {
  const params = useParams<{ classId: string }>()
  const mutations = useCheckStudentMutations()
  const handleCheckAll = useCallback(
    async (status: CheckStatus) => {
      await Promise.all(
        checkDate.checkStudents.map((cs) =>
          mutations.update(cs.id, { status }),
        ),
      )
    },
    [checkDate.checkStudents, mutations],
  )

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>เช็คทั้งหมด</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuGroup>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <ContextMenuItem key={value} onSelect={() => handleCheckAll(value)}>
              {label}
            </ContextMenuItem>
          ))}
        </ContextMenuGroup>
      </ContextMenuSubContent>
    </ContextMenuSub>
  )
}
