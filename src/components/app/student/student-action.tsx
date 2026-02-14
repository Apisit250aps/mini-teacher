'use client'

import ModalDialog from '@/components/share/overlay/modal-dialog'
import React, { useCallback } from 'react'
import StudentForm from '@/components/app/student/student-form'
import { Button } from '@/components/ui/button'
import { useStudentQueries } from '@/hooks/queries/use-student'
import { StudentFormValue } from '@/models/entities'
import { toast } from 'sonner'
import { useOverlay } from '@/hooks/contexts/use-overlay'

export function StudentCreateAction() {
  const { create, list } = useStudentQueries()
  const { closeAll } = useOverlay()

  const onStudentCreate = useCallback(
    async (data: StudentFormValue) => {
      await create.mutateAsync(
        {
          body: {
            code: data.code,
            firstName: data.firstName,
            lastName: data.lastName,
            nickname: data.nickname,
          },
        },
        {
          onSettled(data, error) {
            if (error) {
              toast.error('เกิดข้อผิดพลาดในการสร้างนักเรียน')
              return
            }
            toast.success('สร้างนักเรียนสำเร็จ')
            list.refetch()
            closeAll()
          },
        },
      )
    },
    [create, list, closeAll],
  )

  return (
    <ModalDialog
      title={`เพิ่มนักเรียนใหม่`}
      description={`กรอกข้อมูลนักเรียนเพื่อเพิ่มลงในระบบ`}
      dialogKey="CREATE_STUDENT_ACTION"
      trigger={<Button>สร้างนักเรียน</Button>}
    >
      <StudentForm onSubmit={onStudentCreate} />
    </ModalDialog>
  )
}
