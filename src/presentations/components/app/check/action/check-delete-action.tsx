'use client'

import React, { useCallback } from 'react'
import { Trash } from 'lucide-react'

import { useCheckDateMutations } from '@/hooks/queries'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { ConfirmDialog } from '@/presentations/components/share/overlay/confirm-dialog'
import { ContextMenuItem } from '@/components/ui/context-menu'

export default function CheckDeleteAction({
  checkDateId,
}: {
  checkDateId: string
}) {
  const { remove } = useCheckDateMutations()
  const { closeAll } = useOverlay()

  const handleDelete = useCallback(async () => {
    await remove(checkDateId)
    closeAll()
  }, [remove, checkDateId, closeAll])

  return (
    <ConfirmDialog
      dialogKey={`CHECK_DELETE_ACTION_${checkDateId}`}
      onConfirm={handleDelete}
      title="ยืนยันการลบการเช็คชื่อ"
      description="คุณแน่ใจหรือไม่ว่าต้องการลบการเช็คชื่อนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
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
