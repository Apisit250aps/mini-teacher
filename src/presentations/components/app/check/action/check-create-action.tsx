'use client'

import React, { useCallback } from 'react'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import { Button } from '@/presentations/components/ui/button'
import CheckForm from '../form/check-form'
import { useParams } from 'next/navigation'
import {
  useCheckDateMutations,
  useCheckDatesByClassQuery,
} from '@/hooks/queries'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { CheckDateCreateData, CheckDateUpdateData } from '@/core/domain/data'

export default function CheckCreateAction() {
  const params = useParams<{ classId?: string }>()
  const { create } = useCheckDateMutations()
  const { data } = useCheckDatesByClassQuery(params.classId!)
  const { closeAll } = useOverlay()

  const defaultDate = React.useMemo(() => {
    if (!data || data.length === 0) return new Date()
    const latest = data.reduce((max, item) =>
      new Date(item.date) > new Date(max.date) ? item : max,
    )
    const next = new Date(latest.date)
    next.setDate(next.getDate() + 1)
    return next
  }, [data])

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
      <CheckForm
        value={{ classId: params.classId, date: defaultDate }}
        onSubmit={handleSubmit}
      />
    </ModalDialog>
  )
}
