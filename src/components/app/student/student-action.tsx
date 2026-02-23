'use client'

import ModalDialog from '@/components/share/overlay/modal-dialog'
import React, { useCallback } from 'react'
import StudentForm from '@/components/app/student/student-form'
import { Button } from '@/components/ui/button'
import { useStudentQueries } from '@/hooks/queries/use-student'
import type { Student, StudentFormValue } from '@/models/domain'
import { toast } from 'sonner'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Pen, Trash } from 'lucide-react'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'
import { useClassQueries, useGetClassMembers } from '@/hooks/queries/use-class'
import { useClassContext } from '@/hooks/app/use-class'

export function StudentCreateAction() {
  const { create, list } = useStudentQueries()
  const { closeAll } = useOverlay()

  const onStudentCreate = useCallback(
    async (data: StudentFormValue) => {
      await create.mutateAsync(
        {
          body: {
            prefix: data.prefix,
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
      closeOutside={false}
      trigger={<Button>สร้างนักเรียน</Button>}
    >
      <StudentForm onSubmit={onStudentCreate} />
    </ModalDialog>
  )
}

export function StudentEditAction({ student }: { student: Student }) {
  const { update, list } = useStudentQueries()
  const member = useGetClassMembers()
  const { closeAll } = useOverlay()

  const onStudentUpdate = useCallback(
    async (data: StudentFormValue) => {
      await update.mutateAsync(
        {
          params: {
            path: {
              studentId: student.id,
            },
          },
          body: {
            prefix: data.prefix,
            code: data.code,
            firstName: data.firstName,
            lastName: data.lastName,
            nickname: data.nickname,
          },
        },
        {
          onSettled(data, error) {
            if (error) {
              toast.error('เกิดข้อผิดพลาดในการแก้ไขนักเรียน')
              return
            }
            toast.success('แก้ไขนักเรียนสำเร็จ')
            list.refetch()
            member.refetch()
            closeAll()
          },
        },
      )
    },
    [closeAll, list, member, student.id, update],
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
  const { remove, list } = useStudentQueries()
  const { closeAll } = useOverlay()

  const onStudentDelete = useCallback(async () => {
    await remove.mutateAsync(
      {
        params: {
          path: {
            studentId: studentId,
          },
        },
      },
      {
        onSettled(data, error) {
          if (error) {
            toast.error('เกิดข้อผิดพลาดในการลบนักเรียน')
            return
          }
          toast.success('ลบนักเรียนสำเร็จ')
          list.refetch()
          closeAll()
        },
      },
    )
  }, [closeAll, list, remove, studentId])

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
  const { addOrRemoveMember } = useClassQueries()
  const member = useGetClassMembers()
  const { activeClass } = useClassContext()
  const { closeAll } = useOverlay()

  const onStudentDelete = useCallback(async () => {
    await addOrRemoveMember.mutateAsync(
      {
        params: {
          path: {
            classId: activeClass!.id!,
          },
        },
        body: {
          studentId: studentId,
        },
      },
      {
        onSuccess() {
          member.refetch()
          closeAll()
        },
      },
    )
  }, [activeClass, addOrRemoveMember, closeAll, member, studentId])

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
