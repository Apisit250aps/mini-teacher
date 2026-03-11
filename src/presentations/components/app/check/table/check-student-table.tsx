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

  // const autoLimit = React.useMemo(() => {
  //   const count = query.data?.length ?? 0
  //   if (count > 20) return 30
  //   if (count > 10) return 20
  //   return 5
  // }, [query.data])

  const table = React.useMemo(
    () => ({
      columns: cols,
      data: query.data.map((classMember) => classMember.student) || [],
      isLoading: query.isLoading,
      autoWidth: !query.isLoading,
    }),
    [query, cols],
  )

  return <DataTable {...table} filterCols={['code', 'firstName']} />
}
