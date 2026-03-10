'use client'

import React, { useCallback } from 'react'
import { Lock, LockOpen } from 'lucide-react'

import { CheckDateWithStudents } from '@/core/domain/data'
import { useCheckDateMutations } from '@/hooks/queries'
import { ContextMenuItem } from '@/components/ui/context-menu'

export default function CheckLockAction({
  checkDate,
}: {
  checkDate: CheckDateWithStudents
}) {
  const { update } = useCheckDateMutations()

  const handleToggle = useCallback(async () => {
    await update(checkDate.id, { isEditable: !checkDate.isEditable })
  }, [update, checkDate.id, checkDate.isEditable])

  return (
    <ContextMenuItem onSelect={handleToggle}>
      {checkDate.isEditable ? <LockOpen /> : <Lock />}
      {checkDate.isEditable ? 'ล็อคการเช็คชื่อ' : 'ปลดล็อคการเช็คชื่อ'}
    </ContextMenuItem>
  )
}
