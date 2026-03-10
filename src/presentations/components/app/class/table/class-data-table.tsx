import { useYearContext } from '@/hooks/app/use-year'
import { useClassesByYearQuery } from '@/hooks/queries'
import React from 'react'
import { classDataColumns } from './class-data-columns'
import DataTable from '@/presentations/components/share/table/data-table'

export default function ClassDataTable() {
  const { active } = useYearContext()
  const query = useClassesByYearQuery(active?.id || '')

  const table = React.useMemo(
    () => ({
      columns: classDataColumns,
      data: query.data || [],
      isLoading: query.isLoading,
    }),
    [query],
  )

  return <DataTable {...table} />
}
