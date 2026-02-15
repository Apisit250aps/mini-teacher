'use client'
import React, { useCallback } from 'react'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { Button } from '@/components/ui/button'
import StudentForm from '@/components/app/student/student-form'
import { StudentFormValue } from '@/models/entities/student.entity'
import { useClassQueries } from '@/hooks/queries/use-class'

export default function MemberCreate() {
  const {} = useClassQueries()
  const onStudentCreate = useCallback(async (studentData: StudentFormValue) => {
    // Handle student creation logic here
  }, [])

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
