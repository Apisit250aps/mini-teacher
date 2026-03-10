'use client'

import React, { useCallback } from 'react'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import { Button } from '@/presentations/components/ui/button'
import CheckForm from '../form/check-form'
import { useParams } from 'next/navigation'
import { useCheckDateMutations } from '@/hooks/queries'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { CheckDateCreateData, CheckDateUpdateData } from '@/core/domain/data'

export default function CheckCreateAction() {
  const params = useParams<{ classId?: string }>()
  const { create } = useCheckDateMutations()
  const { closeAll } = useOverlay()

  const handleSubmit = useCallback(
    async (data: CheckDateCreateData | CheckDateUpdateData) => {
      await create(data as CheckDateCreateData)
      closeAll()
    },
    [create, closeAll],
  )

  return (
    <ModalDialog
      title={'สร้างการเช็คชื่อ'}
      description="สร้างการเช็คชื่อ"
      dialogKey={'CREATE_CHECK_ACTION'}
      trigger={<Button>สร้างการเช็คชื่อ</Button>}
      closeOutside={false}
    >
      <CheckForm value={{ classId: params.classId }} onSubmit={handleSubmit} />
    </ModalDialog>
  )
}
