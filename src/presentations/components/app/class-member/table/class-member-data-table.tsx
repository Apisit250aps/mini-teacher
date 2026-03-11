'use client'

import { useClassMembersByClassQuery } from '@/hooks/queries/class-member-query'
import DataTable from '@/presentations/components/share/table/data-table'
import { useParams } from 'next/navigation'
import React, { useMemo } from 'react'
import { classMemberDataColumns } from './class-member-data-columns'

export default function ClassMemberDataTable() {
  const params = useParams<{ classId?: string }>()
  const query = useClassMembersByClassQuery(params.classId ?? '')

  const table = useMemo(
    () => ({
      columns: classMemberDataColumns,
      data: query.data.map((classMember) => classMember.student) ?? [],
      isLoading: query.isLoading,
    }),
    [query],
  )

  return <DataTable {...table} filterCols={['code', 'prefix', 'firstName', 'lastName', 'nickname']} />
}
