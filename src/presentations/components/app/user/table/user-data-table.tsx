'use client'
import React from 'react'
import { useAdminUsersQuery } from '@/hooks/queries'
import DataTable from '@/presentations/components/share/table/data-table'
import { userDataColumns } from './user-data-columns'

export default function UserDataTable() {
  const { data, isLoading } = useAdminUsersQuery()

  const table = React.useMemo(
    () => ({
      columns: userDataColumns,
      data: data ?? [],
      isLoading,
    }),
    [data, isLoading],
  )

  return <DataTable {...table} filterCols={['name', 'email']} />
}
