'use client'
import React, { useCallback } from 'react'

import { ClassWithMembers } from '@/core/domain/repositories/class'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import { useClassMutations } from '@/hooks/queries/class-query'
import { ClassUpdateData } from '@/core/domain/data'
import ClassForm from '../form/class-form'
import { DropdownMenuItem } from '@/presentations/components/ui/dropdown-menu'
import { Pen } from 'lucide-react'

export default function ClassEditAction({
  classData,
}: {
  classData: ClassWithMembers
}) {
  const { update } = useClassMutations()
  const ui = useOverlay()
  const handleSubmit = useCallback(
    async (data: ClassUpdateData) => {
      await update(classData.id, data)
      ui.closeAll()
    },
    [update, ui, classData.id],
  )
  return (
    <ModalDialog
      title={'แก้ไขห้องเรียน'}
      description="แก้ไขห้องเรียน"
      dialogKey={`CLASS_EDIT_ACTION_${classData.id}`}
      trigger={
        <DropdownMenuItem>
          <Pen />
          แก้ไข
        </DropdownMenuItem>
      }
      closeOutside={false}
    >
      <ClassForm
        value={{
          ...classData,
        }}
        onSubmit={handleSubmit}
      />
    </ModalDialog>
  )
}
