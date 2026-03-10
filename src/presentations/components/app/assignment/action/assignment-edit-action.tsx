'use client'

import React, { useCallback } from 'react'
import { Pen } from 'lucide-react'

import {
  ScoreAssignWithScores,
  ScoreAssignUpdateData,
} from '@/core/domain/data'
import { useScoreAssignMutations } from '@/hooks/queries'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import AssignmentForm from '../form/assignment-form'
import { ContextMenuItem } from '@/components/ui/context-menu'

export default function AssignmentEditAction({
  assignment,
}: {
  assignment: ScoreAssignWithScores
}) {
  const { update } = useScoreAssignMutations()
  const ui = useOverlay()

  const handleSubmit = useCallback(
    async (data: ScoreAssignUpdateData) => {
      await update(assignment.id, data)
      ui.closeAll()
    },
    [update, assignment.id, ui],
  )

  return (
    <ModalDialog
      title={'แก้ไขงาน/ข้อสอบ'}
      description="แก้ไขงาน/ข้อสอบ"
      dialogKey={`ASSIGNMENT_EDIT_ACTION_${assignment.id}`}
      trigger={
        <ContextMenuItem onSelect={(e) => e.preventDefault()}>
          <Pen />
          แก้ไข
        </ContextMenuItem>
      }
      closeOutside={false}
    >
      <AssignmentForm value={{ ...assignment }} onSubmit={handleSubmit} />
    </ModalDialog>
  )
}
