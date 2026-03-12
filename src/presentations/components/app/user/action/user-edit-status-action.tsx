'use client'
import React, { useCallback } from 'react'
import { User } from '@/core/domain/entities'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useUserMutations } from '@/hooks/queries'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import { DropdownMenuItem } from '@/presentations/components/ui/dropdown-menu'
import { ShieldCheck } from 'lucide-react'
import UserStatusForm, { UserStatusFormData } from '../form/user-status-form'

export default function UserEditStatusAction({ user }: { user: User }) {
  const { update } = useUserMutations()
  const ui = useOverlay()

  const handleSubmit = useCallback(
    async (data: UserStatusFormData) => {
      await update(user.id, data)
      ui.closeAll()
    },
    [user.id, ui, update],
  )

  return (
    <ModalDialog
      title="แก้ไขสถานะผู้ใช้"
      description="กำหนดสิทธิ์และสถานะของผู้ใช้งาน"
      dialogKey={`USER_EDIT_STATUS_ACTION_${user.id}`}
      trigger={
        <DropdownMenuItem>
          <ShieldCheck />
          แก้ไขสถานะ
        </DropdownMenuItem>
      }
      closeOutside={false}
    >
      <UserStatusForm value={user} onSubmit={handleSubmit} />
    </ModalDialog>
  )
}
