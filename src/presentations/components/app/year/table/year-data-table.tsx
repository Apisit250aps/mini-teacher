'use client'
import DataTable from '@/presentations/components/share/table/data-table'
import { useMemo } from 'react'
import { yearColumns } from './year-columns'
import { useYearsListQuery } from '@/hooks/queries'
import { useYearContext } from '@/hooks/app/use-year'

export default function YearDataTable() {
  const { teacher } = useYearContext()
  const query = useYearsListQuery({
    where: {
      userId: teacher,
    },
    orderBy: [{ term: 'desc' }, { year: 'desc' }],
  })

  const props = useMemo(() => {
    return {
      columns: yearColumns,
      data: query.data || [],
      isLoading: query.isLoading,
    }
  }, [query])

  return <DataTable {...props} />
}
