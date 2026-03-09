'use client'

import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import React, { useCallback } from 'react'
import StudentForm from '@/presentations/components/app/student/student-form'
import { Button } from '@/presentations/components/ui/button'
import {
  useClassMemberMutations,
  useClassMembersByClassQuery,
  useStudentMutations,
  useStudentsByTeacherQuery,
} from '@/hooks/queries'
import { Student, StudentFormValue } from '@/models/entities'
import { toast } from 'sonner'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { DropdownMenuItem } from '@/presentations/components/ui/dropdown-menu'
import { Pen, Trash } from 'lucide-react'
import { ConfirmDialog } from '@/presentations/components/share/overlay/confirm-dialog'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'

export function StudentCreateAction() {
  const { teacher } = useYearContext()
  const { create } = useStudentMutations()
  const list = useStudentsByTeacherQuery(teacher)
  const { closeAll } = useOverlay()

  const onStudentCreate = useCallback(
    async (data: StudentFormValue) => {
      try {
        await create({
          teacherId: teacher,
          prefix: data.prefix,
          code: data.code,
          firstName: data.firstName,
          lastName: data.lastName,
          nickname: data.nickname,
        })
        await list.query.refetch()
        toast.success('สร้างนักเรียนสำเร็จ')
        closeAll()
      } catch {
        toast.error('เกิดข้อผิดพลาดในการสร้างนักเรียน')
      }
    },
    [closeAll, create, list.query, teacher],
  )

  return (
    <ModalDialog
      title={`เพิ่มนักเรียนใหม่`}
      description={`กรอกข้อมูลนักเรียนเพื่อเพิ่มลงในระบบ`}
      dialogKey="CREATE_STUDENT_ACTION"
      closeOutside={false}
      trigger={<Button>สร้างนักเรียน</Button>}
    >
      <StudentForm onSubmit={onStudentCreate} />
    </ModalDialog>
  )
}

export function StudentEditAction({ student }: { student: Student }) {
  const { teacher } = useYearContext()
  const { activeClass } = useClassContext()
  const { update } = useStudentMutations()
  const list = useStudentsByTeacherQuery(teacher)
  const member = useClassMembersByClassQuery(activeClass?.id ?? '')
  const { closeAll } = useOverlay()

  const onStudentUpdate = useCallback(
    async (data: StudentFormValue) => {
      try {
        await update(student.id, {
          prefix: data.prefix,
          code: data.code,
          firstName: data.firstName,
          lastName: data.lastName,
          nickname: data.nickname,
        })
        await Promise.all([list.query.refetch(), member.query.refetch()])
        toast.success('แก้ไขนักเรียนสำเร็จ')
        closeAll()
      } catch {
        toast.error('เกิดข้อผิดพลาดในการแก้ไขนักเรียน')
      }
    },
    [closeAll, list.query, member.query, student.id, update],
  )

  return (
    <ModalDialog
      title={`แก้ไขนักเรียน`}
      description={`กรอกข้อมูลนักเรียนเพื่อแก้ไขในระบบ`}
      dialogKey="EDIT_STUDENT_ACTION"
      closeOutside={false}
      trigger={
        <DropdownMenuItem>
          <Pen />
          แก้ไขนักเรียน
        </DropdownMenuItem>
      }
    >
      <StudentForm
        value={{
          prefix: student.prefix,
          code: student.code,
          firstName: student.firstName,
          lastName: student.lastName,
          nickname: student.nickname,
        }}
        onSubmit={onStudentUpdate}
      />
    </ModalDialog>
  )
}

export function StudentDeleteAction({ studentId }: { studentId: string }) {
  const { teacher } = useYearContext()
  const { remove } = useStudentMutations()
  const list = useStudentsByTeacherQuery(teacher)
  const { closeAll } = useOverlay()

  const onStudentDelete = useCallback(async () => {
    try {
      await remove(studentId)
      await list.query.refetch()
      toast.success('ลบนักเรียนสำเร็จ')
      closeAll()
    } catch {
      toast.error('เกิดข้อผิดพลาดในการลบนักเรียน')
    }
  }, [closeAll, list.query, remove, studentId])

  return (
    <ConfirmDialog
      dialogKey={`DELETE_STUDENT_${studentId}`}
      trigger={
        <DropdownMenuItem variant="destructive" className="text-destructive">
          <Trash />
          ลบนักเรียน
        </DropdownMenuItem>
      }
      title="ยืนยันการลบนักเรียน"
      description="คุณแน่ใจหรือไม่ว่าต้องการลบนักเรียนนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
      onConfirm={() => onStudentDelete()}
    />
  )
}

export function MemberDeleteAction({ studentId }: { studentId: string }) {
  const { remove } = useClassMemberMutations()
  const { activeClass } = useClassContext()
  const member = useClassMembersByClassQuery(activeClass?.id ?? '')
  const { closeAll } = useOverlay()

  const onStudentDelete = useCallback(async () => {
    if (!activeClass?.id) return

    await remove({
      classId: activeClass.id,
      studentId,
    })

    await member.query.refetch()
    closeAll()
  }, [activeClass, closeAll, member.query, remove, studentId])

  return (
    <ConfirmDialog
      dialogKey={`REMOVE_MEMBER_${studentId}`}
      trigger={
        <DropdownMenuItem variant="destructive" className="text-destructive">
          <Trash />
          ลบนักเรียน
        </DropdownMenuItem>
      }
      title="ยืนยันการลบนักเรียน"
      description="คุณแน่ใจหรือไม่ว่าต้องการลบนักเรียนนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
      onConfirm={() => onStudentDelete()}
    />
  )
}
