'use client'
import React from 'react'
import { User } from '@/core/domain/entities'
import { ColumnDef, Cell } from '@tanstack/react-table'
import { Badge } from '@/presentations/components/ui/badge'
import { ActionDropdown } from '@/presentations/components/share/overlay/action-dropdown'
import UserEditStatusAction from '../action/user-edit-status-action'

const UserActionColumn = ({ cell }: { cell: Cell<User, unknown> }) => (
  <ActionDropdown id={`USER_ACTION_${cell.row.original.id}`}>
    <UserEditStatusAction user={cell.row.original} />
  </ActionDropdown>
)

const BooleanBadge = ({
  value,
  trueLabel,
  falseLabel,
}: {
  value: boolean
  trueLabel: string
  falseLabel: string
}) => (
  <Badge variant={value ? 'default' : 'secondary'}>
    {value ? trueLabel : falseLabel}
  </Badge>
)

export const userDataColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'ชื่อบัญชี',
    cell: ({ row }) => {
      const fullName = [row.original.firstName, row.original.lastName]
        .filter(Boolean)
        .join(' ')
      return (
        <div>
          <p className="font-medium">{row.original.name ?? fullName ?? '-'}</p>
          {fullName && row.original.name && (
            <p className="text-xs text-muted-foreground">{fullName}</p>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'อีเมล',
    cell: ({ getValue }) => (
      <span className="text-sm">{(getValue() as string) ?? '-'}</span>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'สถานะ',
    cell: ({ getValue }) => (
      <BooleanBadge
        value={getValue() as boolean}
        trueLabel="เปิดใช้งาน"
        falseLabel="ปิดใช้งาน"
      />
    ),
  },
  {
    accessorKey: 'isTeacher',
    header: 'ครูผู้สอน',
    cell: ({ getValue }) => (
      <BooleanBadge
        value={getValue() as boolean}
        trueLabel="ใช่"
        falseLabel="ไม่ใช่"
      />
    ),
  },
  {
    accessorKey: 'isAdmin',
    header: 'ผู้ดูแลระบบ',
    cell: ({ getValue }) => (
      <BooleanBadge
        value={getValue() as boolean}
        trueLabel="ใช่"
        falseLabel="ไม่ใช่"
      />
    ),
  },
  { header: 'จัดการ', cell: UserActionColumn },
]
