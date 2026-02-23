'use client'
import DataTable from '@/components/share/table/data-table'
import { useClassQueries, useGetClassMembers } from '@/hooks/queries/use-class'
import type { ClassMemberDetail } from '@/models/domain'
import { Cell, ColumnDef } from '@tanstack/react-table'
import MemberCreate from '@/components/app/class/member/member-create'
import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import {
  MemberDeleteAction,
  StudentEditAction,
} from '@/components/app/student/student-action'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import StudentSelectTable from '@/components/app/student/student-select-table'
import { Button } from '@/components/ui/button'
import { useClassContext } from '@/hooks/app/use-class'
import { useOverlay } from '@/hooks/contexts/use-overlay'

const ColumnActions = ({
  cell,
}: {
  cell: Cell<ClassMemberDetail, unknown>
}) => {
  return (
    <ActionDropdown id={'MEMBER_ACTION_COLUMN_' + cell.row.original.id}>
      <StudentEditAction student={cell.row.original.student} />
      <MemberDeleteAction studentId={cell.row.original.student.id} />
    </ActionDropdown>
  )
}

const columns: ColumnDef<ClassMemberDetail>[] = [
  {
    accessorKey: 'student.code',
    header: 'รหัสนักเรียน',
    cell: ({ row }) => {
      const student = row.original.student.code
      return student
    },
  },
  {
    accessorKey: 'student.prefix',
    header: 'คำนำหน้า',
    cell: ({ row }) => {
      const student = row.original.student.prefix
      return student
    },
  },
  {
    accessorKey: 'student.firstName',
    header: 'ชื่อ',
    cell: ({ row }) => {
      const student = row.original.student.firstName
      return student
    },
  },
  {
    accessorKey: 'student.lastName',
    header: 'นามสกุล',
    cell: ({ row }) => {
      const student = row.original.student.lastName
      return student
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'เข้าร่วมเมื่อ',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
      return createdAt
    },
  },
  {
    id: 'actions',
    header: 'จัดการ',
    cell: ColumnActions,
  },
]

const MemberAdd = () => {
  const membersQuery = useGetClassMembers()
  const { addOrRemoveMember } = useClassQueries()
  const { activeClass } = useClassContext()
  const { closeAll } = useOverlay()

  const { data: members } = membersQuery

  const existingStudentIds = members?.map((member) => member.student.id) ?? []

  const onSubmit = async (studentIds: string[]) => {
    const excludedIds = existingStudentIds
    const filteredIds = studentIds.filter((id) => !excludedIds.includes(id))
    if (filteredIds.length > 0) {
      const promises = filteredIds.map((studentId) => {
        return addOrRemoveMember.mutateAsync({
          params: {
            path: {
                classId: activeClass?.id || '',
            },
          },
          body: {
            studentId,
          },
        })
      })
      await Promise.all(promises)
      membersQuery.refetch()
      closeAll()
    }
  }

  return (
    <ModalDialog
      trigger={<Button>เพิ่มสมาชิก</Button>}
      title={'เพิ่มสมาชิกจากรายชื่อนักเรียน'}
      description={'เลือกนักเรียนที่ต้องการเพิ่มลงในคลาส'}
    >
      <StudentSelectTable onSubmit={onSubmit} />
    </ModalDialog>
  )
}

export default function ClassMemberSection() {
  const { data: members } = useGetClassMembers()

  return (
    <div className="flex flex-col items-center gap-4 w-full ">
      <div className="flex w-full justify-end gap-2">
        <MemberAdd />
        <MemberCreate />
      </div>
      <div className="w-full">
        <DataTable data={members ?? []} columns={columns} />
      </div>
    </div>
  )
}
