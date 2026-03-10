'use client'

import { useCallback } from 'react'

import { CheckDateWithStudents } from '@/core/domain/data'
import { CheckStatus } from '@/core/domain/entities'
import { useCheckStudentMutations } from '@/hooks/queries'
import { useClassMembersByClassQuery } from '@/hooks/queries/class-member-query'
import {
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu'
import { useQueryClient } from '@tanstack/react-query'

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
  const queryClient = useQueryClient()
  const mutations = useCheckStudentMutations()
  const { data: classMembers } = useClassMembersByClassQuery(checkDate.classId)

  const handleCheckAll = useCallback(
    async (status: CheckStatus) => {
      if (!classMembers) return
      await Promise.all(
        classMembers.map((cm) => {
          const existing = checkDate.checkStudents.find(
            (cs) => cs.studentId === cm.student.id,
          )
          if (existing) {
            return mutations.update(existing.id, { status })
          } else {
            return mutations.create({
              checkDateId: checkDate.id,
              studentId: cm.student.id,
              status,
            })
          }
        }),
      )
      queryClient.invalidateQueries({})
    },
    [checkDate, classMembers, mutations, queryClient],
  )

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger
        disabled={checkDate.isEditable === false}
      >
        เช็คทั้งหมด
      </ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuGroup>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <ContextMenuItem
              key={value}
              onSelect={() => handleCheckAll(value)}
              disabled={checkDate.isEditable === false}
            >
              {label}
            </ContextMenuItem>
          ))}
        </ContextMenuGroup>
      </ContextMenuSubContent>
    </ContextMenuSub>
  )
}
