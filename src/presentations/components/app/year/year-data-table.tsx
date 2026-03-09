'use client'
import DataTable from '@/presentations/components/share/table/data-table'
import { useMemo } from 'react'
import { yearColumns } from './year-columns'
import { useSession } from 'next-auth/react'
import { useYearsListQuery } from '@/hooks/queries'

export default function YearDataTable() {
  const session = useSession()
  const query = useYearsListQuery({
    where: {
      userId: session.data?.user.id,
    },
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
