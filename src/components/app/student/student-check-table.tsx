"use client"

import React from 'react'
import DataTable from '@/components/share/table/data-table'
import { CheckDateCreateAction } from '../class/check/action-modal'
import { useStudentCheckTable } from '@/hooks/app/use-check'

export default function StudentCheckTable() {
  const { columns, tableData, tableLimit, isLoading } = useStudentCheckTable()

  return (
    <div className="w-full max-w-full min-w-0">
      <div className="flex items-center justify-end">
        <CheckDateCreateAction />
      </div>
      <div className="w-full max-w-full min-w-0 mt-4">
        <DataTable
          columns={columns}
          data={tableData}
          limit={tableLimit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
