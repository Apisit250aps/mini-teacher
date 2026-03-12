'use client'
import React, { useCallback } from 'react'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useUserMutations } from '@/hooks/queries'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import { Button } from '@/presentations/components/ui/button'
import UserForm, { UserFormData } from '../form/user-form'

export default function UserCreateAction() {
  const { create } = useUserMutations()
  const ui = useOverlay()

  const handleSubmit = useCallback(
    async (data: UserFormData) => {
      await create(data)
      ui.closeAll()
    },
    [create, ui],
  )

  return (
    <ModalDialog
      title="เพิ่มผู้ใช้งาน"
      description="สร้างบัญชีผู้ใช้งานใหม่ในระบบ"
      dialogKey="USER_CREATE_ACTION"
      trigger={<Button>เพิ่มผู้ใช้</Button>}
      closeOutside={false}
    >
      <UserForm onSubmit={handleSubmit} />
    </ModalDialog>
  )
}
