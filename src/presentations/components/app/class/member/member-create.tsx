'use client'
import React, { useCallback } from 'react'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import { Button } from '@/presentations/components/ui/button'
import StudentForm from '@/presentations/components/app/student/student-form'
import { StudentFormValue } from '@/models/entities/student.entity'
import {
  useClassMemberMutations,
  useClassMembersByClassQuery,
  useStudentMutations,
} from '@/hooks/queries'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import { toast } from 'sonner'
import { useOverlay } from '@/hooks/contexts/use-overlay'

export default function MemberCreate() {
  const { create: createStudent } = useStudentMutations()
  const { create: addMember } = useClassMemberMutations()
  const { activeClass } = useClassContext()
  const { teacher } = useYearContext()
  const { closeAll } = useOverlay()
  const member = useClassMembersByClassQuery(activeClass?.id ?? '')

  const onStudentCreate = useCallback(
    async (studentData: StudentFormValue) => {
      if (!activeClass?.id) return

      try {
        const student = await createStudent({
          teacherId: teacher,
          code: studentData.code,
          prefix: studentData.prefix,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          nickname: studentData.nickname,
        })

        await addMember({
          classId: activeClass.id,
          studentId: student.id,
        })

        await member.query.refetch()
        toast.success('เพิ่มนักเรียนเรียบร้อยแล้ว')
        closeAll()
      } catch {
        toast.error('เกิดข้อผิดพลาดในการเพิ่มนักเรียน')
      }
    },
    [activeClass, addMember, closeAll, createStudent, member.query, teacher],
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
