import { ClassWithMembers } from '@/core/domain/data'
import { ColumnDef } from '@tanstack/react-table'

export const classDataColumns: ColumnDef<ClassWithMembers>[] = [
  {
    accessorKey: 'name',
    header: 'ชื่อห้องเรียน',
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
]
