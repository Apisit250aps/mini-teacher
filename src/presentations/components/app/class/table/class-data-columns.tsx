import { ClassWithMembers } from '@/core/domain/data'
import { ActionDropdown } from '@/presentations/components/share/overlay/action-dropdown'
import { Cell, ColumnDef } from '@tanstack/react-table'
import ClassEditAction from '../action/class-edit-action'
import ClassDeleteAction from '../action/class-delete-action'

const ClassActionColumn = ({
  cell,
}: {
  cell: Cell<ClassWithMembers, unknown>
}) => {
  return (
    <ActionDropdown id={`CLASS_ACTION_${cell.row.original.id}`}>
      <ClassEditAction classData={cell.row.original} />
      <ClassDeleteAction classId={cell.row.original.id} />
    </ActionDropdown>
  )
}

export const classDataColumns: ColumnDef<ClassWithMembers>[] = [
  {
    accessorKey: 'name',
    header: 'ชื่อห้องเรียน',
  },
  {
    accessorKey: 'subject',
    header: 'ชื่อวิชา',
  },
  {
    accessorKey: 'description',
    header: 'รายละเอียด',
  },
  {
    accessorKey: 'classMembers',
    header: 'จำนวนสมาชิก',
    cell: ({ getValue }) => {
      const members = getValue() as ClassWithMembers['classMembers']
      return members.length
    },
  },
  {
    header: 'จัดการ',
    cell: ClassActionColumn,
  },
]
