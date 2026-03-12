import { useYearContext } from '@/hooks/app/use-year'
import { useClassesByYearQuery } from '@/hooks/queries'
import React from 'react'
import {  useClassDataColumns } from './class-data-columns'
import DataTable from '@/presentations/components/share/table/data-table'

export default function ClassDataTable() {
  const { active } = useYearContext()
  const query = useClassesByYearQuery(active?.id || '')
  const cols = useClassDataColumns()
  const table = React.useMemo(
    () => ({
      columns: cols,
      data: query.data || [],
      isLoading: query.isLoading,
    }),
    [cols, query],
  )

  return <DataTable {...table} />
}
