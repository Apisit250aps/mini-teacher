'use client'
import DataTable from '@/components/share/table/data-table'
import { useGetClassMembers } from '@/hooks/queries/use-class'
import { ClassMemberDetail } from '@/models/entities'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

const columns: ColumnDef<ClassMemberDetail>[] = [
  {
    accessorKey: 'student.prefix',
    header: 'คำนำหน้า',
    cell: ({ row }) => {
      const student = row.original.student.prefix
      return student
    },
  },
  {
    accessorKey: 'student.firstName',
    header: 'ชื่อ',
    cell: ({ row }) => {
      const student = row.original.student.firstName
      return student
    },
  },
  {
    accessorKey: 'student.lastName',
    header: 'นามสกุล',
    cell: ({ row }) => {
      const student = row.original.student.lastName
      return student
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'เข้าร่วมเมื่อ',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
      return createdAt
    },
  }
]

export default function ClassMemberSection({ classId }: { classId: string }) {
  const { data } = useGetClassMembers(classId)
  return (
    <div className="w-full">
      <DataTable data={data?.data ?? []} columns={columns} />
    </div>
  )
}
