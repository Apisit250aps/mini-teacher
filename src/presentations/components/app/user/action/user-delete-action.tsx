'use client'
import React, { useCallback } from 'react'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useUserMutations } from '@/hooks/queries'
import { ConfirmDialog } from '@/presentations/components/share/overlay/confirm-dialog'
import { DropdownMenuItem } from '@/presentations/components/ui/dropdown-menu'
import { Trash } from 'lucide-react'

export default function UserDeleteAction({ userId }: { userId: string }) {
  const { remove } = useUserMutations()
  const { closeAll } = useOverlay()

  const handleDelete = useCallback(async () => {
    await remove(userId)
    closeAll()
  }, [closeAll, remove, userId])

  return (
    <ConfirmDialog
      dialogKey={`USER_DELETE_ACTION_${userId}`}
      onConfirm={handleDelete}
      title="ยืนยันการลบผู้ใช้"
      description="คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้คนนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
      trigger={
        <DropdownMenuItem variant="destructive" className="text-destructive">
          <Trash />
          ลบ
        </DropdownMenuItem>
      }
    />
  )
}
