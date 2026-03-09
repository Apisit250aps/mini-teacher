'use client'

import { Cell, ColumnDef } from '@tanstack/react-table'
import { DeleteYearAction, EditYearAction } from './year-actions'
import { ActionDropdown } from '@/presentations/components/share/overlay/action-dropdown'
import { YearWithClasses } from '@/core/domain/data'

const YearActionColumn = ({
  cell,
}: {
  cell: Cell<YearWithClasses, unknown>
}) => {
  return (
    <ActionDropdown id={'YEAR_ACTION_COLUMN_' + cell.row.original.id}>
      <EditYearAction year={cell.row.original} />
      <DeleteYearAction yearId={cell.row.original.id} />
    </ActionDropdown>
  )
}

export const yearColumns: ColumnDef<YearWithClasses>[] = [
  {
    accessorKey: 'year',
    header: 'ปีการศึกษา',
  },
  {
    accessorKey: 'term',
    header: 'ภาคเรียน',
  },
  {
    accessorKey: 'description',
    header: 'รายละเอียด',
  },
  {
    accessorKey: 'classes',
    header: 'จำนวนห้องเรียน',
    cell: ({ getValue }) => {
      const classes = getValue() as YearWithClasses['classes']
      return classes.length
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'สร้างเมื่อ',
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string)
      return date.toLocaleString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
  {
    id: 'actions',
    cell: YearActionColumn,
  },
]
