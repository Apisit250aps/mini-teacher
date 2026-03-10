'use client'

import React, { useCallback } from 'react'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import { Button } from '@/presentations/components/ui/button'
import AssignmentForm from '../form/assignment-form'
import { useParams } from 'next/navigation'
import { useScoreAssignMutations } from '@/hooks/queries'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import {
  ScoreAssignCreateData,
  ScoreAssignUpdateData,
} from '@/core/domain/data'

export default function AssignmentCreateAction() {
  const params = useParams<{ classId?: string }>()
  const { create } = useScoreAssignMutations()
  const { closeAll } = useOverlay()

  const handleSubmit = useCallback(
    async (data: ScoreAssignCreateData | ScoreAssignUpdateData) => {
      await create(data as ScoreAssignCreateData)
      closeAll()
    },
    [create, closeAll],
  )

  return (
    <ModalDialog
      title={'สร้างงาน/ข้อสอบ'}
      description="สร้างงาน/ข้อสอบ"
      dialogKey={'CREATE_ASSIGNMENT_ACTION'}
      trigger={<Button>สร้างงาน/ข้อสอบ</Button>}
      closeOutside={false}
    >
      <AssignmentForm
        value={{ classId: params.classId }}
        onSubmit={handleSubmit}
      />
    </ModalDialog>
  )
}
