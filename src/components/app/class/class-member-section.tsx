'use client'
import DataTable from '@/components/share/table/data-table'
import { useGetClassMembers } from '@/hooks/queries/use-class'
import { ClassMemberDetail, Student } from '@/models/entities'
import { Cell, ColumnDef } from '@tanstack/react-table'
import MemberCreate from './member/member-create'
import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import {
  MemberDeleteAction,
  StudentEditAction,
} from '../student/student-action'

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
    header: 'การกระทำ',
    cell: ColumnActions,
  },
]

export default function ClassMemberSection() {
  const { data: members } = useGetClassMembers()

  return (
    <div className="flex flex-col items-center gap-4 w-full ">
      <div className="flex w-full justify-end">
        <MemberCreate />
      </div>
      <div className="w-full">
        <DataTable data={members?.data ?? []} columns={columns} />
      </div>
    </div>
  )
}
