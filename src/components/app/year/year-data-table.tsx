'use client'
import DataTable from '@/components/share/table/data-table'
import { useYearQueries } from '@/hooks/queries/use-year'
import { useMemo } from 'react'
import { yearColumns } from './year-columns'

export default function YearDataTable() {
  const { list } = useYearQueries()
  const columns = useMemo(() => yearColumns, [])
  const data = useMemo(() => {
    return (list.data || []).map((item) => ({
      ...item,
    }))
  }, [list.data])
  return <DataTable columns={columns} data={data} isLoading={list.isLoading} />
}
