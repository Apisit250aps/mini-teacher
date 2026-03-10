'use client'
import React, { useCallback } from 'react'

import { StudentCreateData } from '@/core/domain/data'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useStudentMutations } from '@/hooks/queries'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import { DropdownMenuItem } from '@/presentations/components/ui/dropdown-menu'
import { Pen } from 'lucide-react'
import StudentForm from '../form/student-form'
import { Student } from '@/core/domain/entities'

export default function StudentEditAction({
  studentData,
}: {
  studentData: Student
}) {
  const { update } = useStudentMutations()
  const ui = useOverlay()

  const handleSubmit = useCallback(
    async (data: StudentCreateData) => {
      await update(studentData.id, {
        ...data
      })
      ui.closeAll()
    },
    [studentData.id, ui, update],
  )

  return (
    <ModalDialog
      title={'แก้ไขข้อมูลนักเรียน'}
      description="แก้ไขข้อมูลนักเรียน"
      dialogKey={`STUDENT_EDIT_ACTION_${studentData.id}`}
      trigger={
        <DropdownMenuItem>
          <Pen />
          แก้ไข
        </DropdownMenuItem>
      }
      closeOutside={false}
    >
      <StudentForm
        value={{
          teacherId: studentData.teacherId,
          code: studentData.code,
          prefix: studentData.prefix,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          nickname: studentData.nickname,
        }}
        onSubmit={handleSubmit}
      />
    </ModalDialog>
  )
}
