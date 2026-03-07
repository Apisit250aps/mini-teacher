'use client'
import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import DataTable from '@/components/share/table/data-table'
import { useStudentQueries } from '@/hooks/queries/use-student'
import { Student } from '@/models/entities'
import { Cell, ColumnDef } from '@tanstack/react-table'
import {
  StudentDeleteAction,
  StudentEditAction,
} from '@/components/app/student/student-action'

const ColumnActions = ({ cell }: { cell: Cell<Student, unknown> }) => {
  return (
    <ActionDropdown id={'STUDENT_ACTION_COLUMN_' + cell.row.original.id}>
      <StudentEditAction student={cell.row.original} />
      <StudentDeleteAction studentId={cell.row.original.id} />
    </ActionDropdown>
  )
}

const columns: ColumnDef<Student>[] = [
  {
    accessorKey: 'code',
    header: 'รหัสนักเรียน',
  },
  {
    accessorKey: 'prefix',
    header: 'คำนำหน้า',
  },
  {
    accessorKey: 'firstName',
    header: 'ชื่อ',
  },
  {
    accessorKey: 'lastName',
    header: 'นามสกุล',
  },
  {
    accessorKey: 'nickname',
    header: 'ชื่อเล่น',
  },
  {
    id: 'actions',
    header: 'จัดการ',
    cell: ColumnActions,
  },
]

export function StudentDataTable() {
  const { list } = useStudentQueries()
  const { data } = list

  return (
    <DataTable
      data={data?.data ?? []}
      columns={columns}
      isLoading={list.isLoading}
    />
  )
}
