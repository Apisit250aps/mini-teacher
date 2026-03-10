import React from 'react'

import { useYearContext } from '@/hooks/app/use-year'
import { useStudentsByTeacherQuery } from '@/hooks/queries'
import DataTable from '@/presentations/components/share/table/data-table'
import { studentDataColumns } from './student-data-columns'

export default function StudentDataTable() {
  const { teacher } = useYearContext()
  const query = useStudentsByTeacherQuery(teacher || '', {
    orderBy:[{code:'asc'}]
  })

  const table = React.useMemo(
    () => ({
      columns: studentDataColumns,
      data: query.data || [],
      isLoading: query.isLoading,
    }),
    [query],
  )

  return <DataTable {...table} />
}
