'use client'
import React, { useCallback } from 'react'
import { ConfirmDialog } from '@/presentations/components/share/overlay/confirm-dialog'
import { useClassMutations } from '@/hooks/queries'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { DropdownMenuItem } from '@/presentations/components/ui/dropdown-menu'
import { Trash } from 'lucide-react'

export default function ClassDeleteAction({ classId }: { classId: string }) {
  const { remove } = useClassMutations()
  const { closeAll } = useOverlay()
  const handleDelete = useCallback(async () => {
    await remove(classId)
    closeAll()
  }, [remove, classId, closeAll])

  return (
    <ConfirmDialog
      dialogKey={`CLASS_DELETE_ACTION`}
      onConfirm={handleDelete}
      title='ยืนยันการลบห้องเรียน'
      description='คุณแน่ใจหรือไม่ว่าต้องการลบห้องเรียนนี้? การกระทำนี้ไม่สามารถย้อนกลับได้'
      trigger={
        <DropdownMenuItem variant="destructive" className="text-destructive">
          <Trash />
          ลบ
        </DropdownMenuItem>
      }
    />
  )
}
