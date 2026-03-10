'use client'

import { ClassMemberWithStudent } from '@/core/domain/data'
import { ColumnDef } from '@tanstack/react-table'

export const classMemberDataColumns: ColumnDef<ClassMemberWithStudent>[] = [
  {
    accessorKey: 'student.code',
    header: 'รหัสนักเรียน',
  },
  {
    accessorKey: 'student.prefix',
    header: 'คำนำหน้า',
  },
  {
    accessorKey: 'student.firstName',
    header: 'ชื่อ',
  },
  {
    accessorKey: 'student.lastName',
    header: 'นามสกุล',
  },
  {
    accessorKey: 'student.nickname',
    header: 'ชื่อเล่น',
  },
]
