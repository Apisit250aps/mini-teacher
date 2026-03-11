'use client'

import { Student } from '@/core/domain/entities'
import { Checkbox } from '@/presentations/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'

export const studentSelectColumns: ColumnDef<Student>[] = [
  {
    id: 'select',
    size: 10,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="เลือกทั้งหมด"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="เลือกแถวนี้"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'code',
    header: 'รหัสนักเรียน',
    size: 120,
  },
  {
    accessorKey: 'firstName',
    header: 'ชื่อ',
    cell: ({ row }) => {
      const { prefix, firstName } = row.original
      return (
        <span>
          {prefix}
          {firstName}
        </span>
      )
    },
  },
  {
    accessorKey: 'lastName',
    header: 'นามสกุล',
  },
]
