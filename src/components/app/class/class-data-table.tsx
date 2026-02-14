'use client'
import DataTable from '@/components/share/table/data-table'
import { useYear } from '@/hooks/app/use-year'
import { useClassQueries } from '@/hooks/queries/use-class'
import { $api } from '@/lib/client'
import { Class } from '@/models/entities'
import React, { useMemo } from 'react'

export default function ClassDataTable() {
  const { activeYear } = useYear()

  const { list } = useClassQueries()

  const data: Class[] = useMemo(() => {
    if (!activeYear) return []
    return (list.data?.data as unknown as Class[]) || ([] as Class[])
  }, [list.data, activeYear])

  return (
    <DataTable
      columns={[
        {
          id: 'name',
          header: 'ชื่อห้องเรียน',
          accessorKey: 'name',
        },
        {
          id: 'createdAt',
          header: 'วันที่สร้าง',
          accessorKey: 'createdAt',
        },
      ]}
      data={data}
    />
  )
}
