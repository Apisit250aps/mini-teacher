'use client'
import DataTable from '@/components/share/table/data-table'
import { useYear } from '@/hooks/app/use-year'
import { $api } from '@/lib/client'
import React, { useMemo } from 'react'

export default function ClassDataTable() {
  const { activeYear } = useYear()

  const { data: rawData } = $api.useQuery('get', '/year/{yearId}/class', {
    params: {
      path: {
        yearId: activeYear?.id || '',
      },
    },
    enabled: !!activeYear,
  })

  const classes = useMemo(() => {
    if (rawData?.success && rawData.data) {
      return rawData.data.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }))
    }
    return []
  }, [rawData])

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
      data={classes}
    />
  )
}
