'use client'
import { ActionDropdown } from '@/presentations/components/share/overlay/action-dropdown'
import DataTable from '@/presentations/components/share/table/data-table'
import { useStudentsByTeacherQuery } from '@/hooks/queries'
import { Student } from '@/models/entities'
import { Cell, ColumnDef } from '@tanstack/react-table'
import {
  StudentDeleteAction,
  StudentEditAction,
} from '@/presentations/components/app/student/student-action'
import { useYearContext } from '@/hooks/app/use-year'

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
  const { teacher } = useYearContext()
  const list = useStudentsByTeacherQuery(teacher)

  return (
    <DataTable
      data={list.data ?? []}
      columns={columns}
      isLoading={list.isLoading}
    />
  )
}
