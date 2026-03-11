'use client'

import { Student } from '@/core/domain/entities';
import { ColumnDef } from '@tanstack/react-table'

export const classMemberDataColumns: ColumnDef<Student>[] = [
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
]
