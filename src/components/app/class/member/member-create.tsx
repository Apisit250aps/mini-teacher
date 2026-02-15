'use client'
import React, { useCallback } from 'react'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { Button } from '@/components/ui/button'
import StudentForm from '@/components/app/student/student-form'
import { StudentFormValue } from '@/models/entities/student.entity'
import { useClassQueries, useGetClassMembers } from '@/hooks/queries/use-class'
import { useClassContext } from '@/hooks/app/use-class'
import { toast } from 'sonner'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useYearContext } from '@/hooks/app/use-year'

export default function MemberCreate() {
  const { addMember } = useClassQueries()
  const { activeClass } = useClassContext()
  const { activeYear } = useYearContext()
  const { closeAll } = useOverlay()
  const member = useGetClassMembers()
  const onStudentCreate = useCallback(
    async (studentData: StudentFormValue) => {
      await addMember.mutateAsync(
        {
          params: {
            path: {
              yearId: activeYear!.id!,
              classId: activeClass!.id!,
            },
          },
          body: {
            code: studentData.code,
            prefix: studentData.prefix,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
          },
        },
        {
          onSettled(data, error) {
            member.refetch()
            if (error) {
              toast.error('เกิดข้อผิดพลาดในการเพิ่มนักเรียน')
              return
            }
            toast.success('เพิ่มนักเรียนเรียบร้อยแล้ว')
            closeAll()
          },
        },
      )
    },
    [addMember, activeYear, activeClass, member, closeAll],
  )

  return (
    <ModalDialog
      title={`เพิ่มนักเรียนใหม่`}
      description={`เพิ่มนักเรียนใหม่เข้าสู่ห้องเรียนของคุณโดยกรอกข้อมูลด้านล่าง โดยรหัสนักเรียนต้องไม่ซ้ำกับนักเรียนคนอื่นในระบบ`}
      dialogKey="CREATE_MEMBER_ACTION"
      closeOutside={false}
      trigger={<Button>สร้างนักเรียน</Button>}
    >
      <StudentForm onSubmit={onStudentCreate} />
    </ModalDialog>
  )
}
