'use client'

import { useCheckDatesByClassQuery } from '@/hooks/queries'
import { ColumnDef } from '@tanstack/react-table'
import { useParams } from 'next/navigation'
import CheckStatusAction from '../action/check-status-action'
import CheckHeaderAction from '../action/check-header-action'
import { Student } from '@/core/domain/entities'

export const useStudentColumns = (): ColumnDef<Student>[] => {
  const params = useParams<{ classId: string }>()
  const { data } = useCheckDatesByClassQuery(params.classId)

  return [
    {
      accessorKey: 'code',
      header: 'รหัสนักเรียน',
      size: 100,
      cell: ({ row }) => {
        const code = row.original.code
        return <span>{code}</span>
      },
    },
    {
      accessorKey: 'firstName',
      header: 'ชื่อนักเรียน',
      size: 200,
      cell: ({ row }) => {
        const { prefix, firstName, lastName } = row.original
        return (
          <span>
            {prefix}
            {firstName} {lastName}
          </span>
        )
      },
    },
    ...(data?.map(
      (checkDate) =>
        ({
          id: checkDate.id,
          size: 75,
          accessorKey: `id`,
          meta: {
            className: 'p-0 relative text-center',
          },
          header: () => {
            return <CheckHeaderAction checkDate={checkDate} />
          },
          cell: ({ row }) => {
            const record = checkDate.checkStudents.find(
              (cs) => cs.studentId === row.original.id,
            )
            return (
              <CheckStatusAction
                checkDateId={checkDate.id}
                studentId={row.original.id}
                record={record}
                disabled={checkDate.isEditable === false}
              />
            )
          },
        }) as ColumnDef<Student>,
    ) ?? []),
  ]
}
