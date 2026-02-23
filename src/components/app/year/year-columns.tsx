import { Cell, ColumnDef } from '@tanstack/react-table'
import { DeleteYearAction, EditYearAction } from './year-actions'
import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import { Class, YearDetail } from '@/models/domain'

const YearActionColumn = ({ cell }: { cell: Cell<YearDetail, unknown> }) => {
  return (
    <ActionDropdown id={'YEAR_ACTION_COLUMN_' + cell.row.original.id}>
      <EditYearAction year={cell.row.original} />
      <DeleteYearAction yearId={cell.row.original.id} />
    </ActionDropdown>
  )
}

export const yearColumns: ColumnDef<YearDetail>[] = [
  {
    accessorKey: 'year',
    header: 'ปีการศึกษา',
  },
  {
    accessorKey: 'term',
    header: 'ภาคเรียน',
  },
  {
    accessorKey: 'classes',
    header: 'จำนวนห้องเรียน',
    cell: ({ getValue }) => {
      const classes = getValue() as Class[]
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
