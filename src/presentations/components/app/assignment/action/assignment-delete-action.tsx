'use client'

import React, { useCallback } from 'react'
import { Trash } from 'lucide-react'

import { useScoreAssignMutations } from '@/hooks/queries'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { ConfirmDialog } from '@/presentations/components/share/overlay/confirm-dialog'
import { ContextMenuItem } from '@/components/ui/context-menu'

export default function AssignmentDeleteAction({
  assignmentId,
}: {
  assignmentId: string
}) {
  const { remove } = useScoreAssignMutations()
  const { closeAll } = useOverlay()

  const handleDelete = useCallback(async () => {
    await remove(assignmentId)
    closeAll()
  }, [remove, assignmentId, closeAll])

  return (
    <ConfirmDialog
      dialogKey={`ASSIGNMENT_DELETE_ACTION_${assignmentId}`}
      onConfirm={handleDelete}
      title="ยืนยันการลบงาน/ข้อสอบ"
      description="คุณแน่ใจหรือไม่ว่าต้องการลบงาน/ข้อสอบนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
      trigger={
        <ContextMenuItem
          variant="destructive"
          onSelect={(e) => e.preventDefault()}
        >
          <Trash />
          ลบ
        </ContextMenuItem>
      }
    />
  )
}
