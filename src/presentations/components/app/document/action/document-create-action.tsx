'use client'
import React, { useCallback } from 'react'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useDocumentMutations } from '@/hooks/queries'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import { Button } from '@/presentations/components/ui/button'
import DocumentForm, { DocumentFormData } from '../form/document-form'
import type { DocumentType } from '@/core/domain/entities/enums'

type DocumentCreateActionProps = {
  defaultType?: DocumentType
}

export default function DocumentCreateAction({
  defaultType,
}: DocumentCreateActionProps) {
  const { create } = useDocumentMutations()
  const ui = useOverlay()
  const dialogKey = `DOCUMENT_CREATE_${defaultType ?? 'ACTION'}`

  const handleSubmit = useCallback(
    async (data: DocumentFormData) => {
      await create(data)
      ui.closeAll()
    },
    [create, ui],
  )

  return (
    <ModalDialog
      title="สร้างเอกสารใหม่"
      description="เพิ่มเวอร์ชันใหม่ของเอกสาร สามารถเขียนเนื้อหาในรูปแบบ Markdown"
      dialogKey={dialogKey}
      trigger={<Button size="sm">+ สร้างเวอร์ชันใหม่</Button>}
      closeOutside={false}
      size="full"
    >
      <DocumentForm
        value={defaultType ? { type: defaultType } : undefined}
        lockType={!!defaultType}
        onSubmit={handleSubmit}
      />
    </ModalDialog>
  )
}
