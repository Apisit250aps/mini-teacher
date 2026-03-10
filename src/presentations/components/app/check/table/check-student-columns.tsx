'use client'

import { ClassMemberWithStudent } from '@/core/domain/data'
import { useCheckDatesByClassQuery } from '@/hooks/queries'
import { ColumnDef } from '@tanstack/react-table'
import { useParams } from 'next/navigation'
import CheckStatusAction from '../action/check-status-action'
import CheckHeaderAction from '../action/check-header-action'

export const useStudentColumns = (): ColumnDef<ClassMemberWithStudent>[] => {
  const params = useParams<{ classId: string }>()
  const { data } = useCheckDatesByClassQuery(params.classId)

  return [
    {
      accessorKey: 'student.code',
      header: 'รหัสนักเรียน',
      size: 100,
      cell: ({ row }) => {
        const code = row.original.student.code
        return <span>{code}</span>
      },
    },
    {
      accessorKey: 'student',
      header: 'ชื่อนักเรียน',
      size: 200,
      cell: ({ row }) => {
        const { prefix, firstName, lastName } = row.original.student
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
          size: 60,
          accessorKey: `id`,
          meta: {
            className: 'p-0 relative text-center',
          },
          header: () => {
            return <CheckHeaderAction checkDate={checkDate} />
          },
          cell: ({ row }) => {
            const record = checkDate.checkStudents.find(
              (cs) => cs.studentId === row.original.student.id,
            )
            return (
              <CheckStatusAction
                checkDateId={checkDate.id}
                studentId={row.original.student.id}
                record={record}
              />
            )
          },
        }) as ColumnDef<ClassMemberWithStudent>,
    ) ?? []),
  ]
}
