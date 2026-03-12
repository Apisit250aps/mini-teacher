'use client'
import React, { useCallback } from 'react'
import { User } from '@/core/domain/entities'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useUserMutations } from '@/hooks/queries'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import { DropdownMenuItem } from '@/presentations/components/ui/dropdown-menu'
import { Pen } from 'lucide-react'
import UserForm, { UserFormData } from '../form/user-form'

export default function UserEditAction({ user }: { user: User }) {
  const { update } = useUserMutations()
  const ui = useOverlay()

  const handleSubmit = useCallback(
    async (data: UserFormData) => {
      await update(user.id, data)
      ui.closeAll()
    },
    [user.id, ui, update],
  )

  return (
    <ModalDialog
      title="แก้ไขข้อมูลผู้ใช้"
      description="แก้ไขข้อมูลและสิทธิ์ของผู้ใช้งาน"
      dialogKey={`USER_EDIT_ACTION_${user.id}`}
      trigger={
        <DropdownMenuItem>
          <Pen />
          แก้ไข
        </DropdownMenuItem>
      }
      closeOutside={false}
    >
      <UserForm value={user} onSubmit={handleSubmit} />
    </ModalDialog>
  )
}
