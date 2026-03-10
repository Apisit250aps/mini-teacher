import { ActionDropdown } from '@/presentations/components/share/overlay/action-dropdown'
import { Cell, ColumnDef } from '@tanstack/react-table'
import StudentDeleteAction from '../action/student-delete-action'
import StudentEditAction from '../action/student-edit-action'
import { Student } from '@/core/domain/entities';

const StudentActionColumn = ({
  cell,
}: {
  cell: Cell<Student, unknown>
}) => {
  return (
    <ActionDropdown id={`STUDENT_ACTION_${cell.row.original.id}`}>
      <StudentEditAction studentData={cell.row.original} />
      <StudentDeleteAction studentId={cell.row.original.id} />
    </ActionDropdown>
  )
}

export const studentDataColumns: ColumnDef<Student>[] = [
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
    header: 'จัดการ',
    cell: StudentActionColumn,
  },
]
