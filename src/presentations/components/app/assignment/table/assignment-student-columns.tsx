'use client'

import { ClassMemberWithStudent } from '@/core/domain/data'
import { useScoreAssignsByClassQuery } from '@/hooks/queries'
import { ColumnDef } from '@tanstack/react-table'
import { useParams } from 'next/navigation'
import AssignmentScoreAction from '../action/assignment-score-action'
import AssignmentHeaderAction from '../action/assignment-header-action'

export const useAssignmentColumns = (): ColumnDef<ClassMemberWithStudent>[] => {
  const params = useParams<{ classId: string }>()
  const { data } = useScoreAssignsByClassQuery(params.classId)

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
      (assignment) =>
        ({
          id: assignment.id,
          size: 90,
          accessorKey: 'id',
          meta: {
            className: 'p-0 relative text-center',
          },
          header: () => {
            return <AssignmentHeaderAction assignment={assignment} />
          },
          cell: ({ row }) => {
            const record = assignment.scores.find(
              (s) => s.studentId === row.original.student.id,
            )
            return (
              <AssignmentScoreAction
                key={record?.id ?? `new-${row.original.student.id}`}
                assignmentId={assignment.id}
                studentId={row.original.student.id}
                record={record}
                minScore={assignment.minScore}
                maxScore={assignment.maxScore}
                disabled={assignment.isEditable === false}
              />
            )
          },
        }) as ColumnDef<ClassMemberWithStudent>,
    ) ?? []),
  ]
}
