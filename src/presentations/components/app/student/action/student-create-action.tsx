'use client'
import React, { useCallback } from 'react'

import { StudentCreateData } from '@/core/domain/data'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useStudentMutations } from '@/hooks/queries'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import { Button } from '@/presentations/components/ui/button'
import StudentForm from '../form/student-form'

export default function StudentCreateAction() {
  const { create } = useStudentMutations()
  const ui = useOverlay()

  const handleSubmit = useCallback(
    async (data: StudentCreateData) => {
      await create(data)
      ui.closeAll()
    },
    [create, ui],
  )

  return (
    <ModalDialog
      title={'เพิ่มนักเรียน'}
      description="สร้างข้อมูลนักเรียน"
      dialogKey={'CREATE_STUDENT_ACTION'}
      trigger={<Button>เพิ่มนักเรียน</Button>}
      closeOutside={false}
    >
      <StudentForm onSubmit={handleSubmit} />
    </ModalDialog>
  )
}
