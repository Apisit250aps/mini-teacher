'use client'

import { ClassMemberWithStudent } from '@/core/domain/data'
import { useCheckDatesByClassQuery } from '@/hooks/queries'
import { ColumnDef } from '@tanstack/react-table'
import { useParams } from 'next/navigation'

export const useStudentColumns = (): ColumnDef<ClassMemberWithStudent>[] => {
  const params = useParams<{ classId: string }>()
  const { data } = useCheckDatesByClassQuery(params.classId)

  return [
    {
      accessorKey: 'student.code',
      header: 'รหัสนักเรียน',
      meta: {
        className: 'sticky left-0 w-12 text-center z-10 bg-white',
      },
      size: 100,
      cell: ({ row }) => {
        const code = row.original.student.code
        return <span>{code}</span>
      },
    },
    {
      accessorKey: 'student',
      header: 'ชื่อนักเรียน',
      meta: {
        className: 'sticky left-[50px] z-10 bg-white',
      },
      size: 200,
      cell: ({ row }) => {
        const fullName =
          '' +
          row.original.student.prefix +
          row.original.student.firstName +
          ' ' +
          row.original.student.lastName
        return <span>{fullName}</span>
      },
    },
    ...(data?.map(
      (checkDate) =>
        ({
          id: checkDate.id,
          size: 30,
          accessorKey: `id`,

          header: new Date(checkDate.date).toLocaleDateString('th-TH', {
            day: '2-digit',
            month: '2-digit',
          }),
          cell: ({ row }) => {
            return (
              <span>
                {checkDate.id}/{row.original.student.code}
              </span>
            )
          },
        }) as ColumnDef<ClassMemberWithStudent>,
    ) ?? []),
  ]
}
