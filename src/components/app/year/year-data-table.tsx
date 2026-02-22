'use client'
import DataTable from '@/components/share/table/data-table'
import { useYearQueries } from '@/hooks/queries/use-year'
import { useMemo } from 'react'
import { yearColumns } from './year-columns'
import { YearDetail } from '@/models'

export default function YearDataTable() {
  const { list } = useYearQueries()
  const columns = useMemo(() => yearColumns, [])
  return (
    <DataTable
      columns={columns}
      data={(list.data as YearDetail[]) || []}
      isLoading={list.isLoading}
    />
  )
}
