'use client'

import React, { useCallback } from 'react'
import { Lock, LockOpen } from 'lucide-react'

import { ScoreAssignWithScores } from '@/core/domain/data'
import { useScoreAssignMutations } from '@/hooks/queries'
import { ContextMenuItem } from '@/components/ui/context-menu'

export default function AssignmentLockAction({
  assignment,
}: {
  assignment: ScoreAssignWithScores
}) {
  const { update } = useScoreAssignMutations()

  const handleToggle = useCallback(async () => {
    await update(assignment.id, { isEditable: !assignment.isEditable })
  }, [update, assignment.id, assignment.isEditable])

  return (
    <ContextMenuItem onSelect={handleToggle}>
      {assignment.isEditable ? <LockOpen /> : <Lock />}
      {assignment.isEditable ? 'ล็อคการแก้ไข' : 'ปลดล็อคการแก้ไข'}
    </ContextMenuItem>
  )
}
