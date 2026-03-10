'use client'

import React, { useCallback } from 'react'
import { Pen } from 'lucide-react'

import { CheckDateWithStudents } from '@/core/domain/data'
import { CheckDateUpdateData } from '@/core/domain/data'
import { useCheckDateMutations } from '@/hooks/queries'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import CheckForm from '../form/check-form'
import { ContextMenuItem } from '@/components/ui/context-menu'

export default function CheckEditAction({
  checkDate,
}: {
  checkDate: CheckDateWithStudents
}) {
  const { update } = useCheckDateMutations()
  const ui = useOverlay()

  const handleSubmit = useCallback(
    async (data: CheckDateUpdateData) => {
      await update(checkDate.id, data)
      ui.closeAll()
    },
    [update, checkDate.id, ui],
  )

  return (
    <ModalDialog
      title={'แก้ไขการเช็คชื่อ'}
      description="แก้ไขการเช็คชื่อ"
      dialogKey={`CHECK_EDIT_ACTION_${checkDate.id}`}
      trigger={
        <ContextMenuItem onSelect={(e) => e.preventDefault()}>
          <Pen />
          แก้ไข
        </ContextMenuItem>
      }
      closeOutside={false}
    >
      <CheckForm value={{ ...checkDate }} onSubmit={handleSubmit} />
    </ModalDialog>
  )
}
