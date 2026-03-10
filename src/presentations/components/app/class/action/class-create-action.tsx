'use client'
import React, { useCallback } from 'react'

import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import { Button } from '@/presentations/components/ui/button'
import ClassForm from '../form/class-form'
import { ClassCreateData } from '@/core/domain/data'
import { useClassMutations } from '@/hooks/queries'
import { useOverlay } from '@/hooks/contexts/use-overlay'

export default function ClassCreateAction() {
  const { create } = useClassMutations()
  const ui = useOverlay()
  const handleSubmit = useCallback(
    async (data: ClassCreateData) => {
      await create(data)
      ui.closeAll()
    },
    [create, ui],
  )
  return (
    <ModalDialog
      title={'สร้างห้องเรียนใหม่'}
      description="สร้างห้องเรียน"
      dialogKey={'CREATE_CLASS_ACTION'}
      trigger={<Button>สร้างห้องเรียน</Button>}
      closeOutside={false}
    >
      <ClassForm onSubmit={handleSubmit} />
    </ModalDialog>
  )
}
