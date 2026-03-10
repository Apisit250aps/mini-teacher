'use client'

import DataTable from '@/presentations/components/share/table/data-table'
import { useParams } from 'next/navigation'
import React from 'react'
import { useStudentColumns } from './check-student-columns'
import { useClassMembersByClassQuery } from '@/hooks/queries/class-member-query'

export default function CheckStudentTable() {
  const params = useParams<{ classId: string }>()
  const query = useClassMembersByClassQuery(params.classId)
  const cols = useStudentColumns()

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
