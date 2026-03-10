'use client'
import React, { useCallback } from 'react'

import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useStudentMutations } from '@/hooks/queries'
import { ConfirmDialog } from '@/presentations/components/share/overlay/confirm-dialog'
import { DropdownMenuItem } from '@/presentations/components/ui/dropdown-menu'
import { Trash } from 'lucide-react'

export default function StudentDeleteAction({
  studentId,
}: {
  studentId: string
}) {
  const { remove } = useStudentMutations()
  const { closeAll } = useOverlay()

  const handleDelete = useCallback(async () => {
    await remove(studentId)
    closeAll()
  }, [closeAll, remove, studentId])

  return (
    <ConfirmDialog
      dialogKey={`STUDENT_DELETE_ACTION_${studentId}`}
      onConfirm={handleDelete}
      title="ยืนยันการลบนักเรียน"
      description="คุณแน่ใจหรือไม่ว่าต้องการลบนักเรียนคนนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
      trigger={
        <DropdownMenuItem variant="destructive" className="text-destructive">
          <Trash />
          ลบ
        </DropdownMenuItem>
      }
    />
  )
}
