'use client'

import DataTable from '@/presentations/components/share/table/data-table'
import { useParams } from 'next/navigation'
import React from 'react'
import { useAssignmentColumns } from './assignment-student-columns'
import { useClassMembersByClassQuery } from '@/hooks/queries/class-member-query'

export default function AssignmentStudentTable() {
  const params = useParams<{ classId: string }>()
  const query = useClassMembersByClassQuery(params.classId)
  const cols = useAssignmentColumns()

  const table = React.useMemo(
    () => ({
      columns: cols,
      data: query.data || [],
      isLoading: query.isLoading,
      autoWidth: !query.isLoading,
    }),
    [query, cols],
  )

  return <DataTable {...table} />
}
