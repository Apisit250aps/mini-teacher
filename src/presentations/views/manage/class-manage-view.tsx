'use client'
import React from 'react'

import ClassDataTable from '@/presentations/components/app/class/table/class-data-table'
import PageLayout from '@/presentations/components/layouts/page-layout'
import ClassCreateAction from '@/presentations/components/app/class/action/class-create-action'

export default function ClassManageView() {
  return (
    <PageLayout
      title={'ห้องเรียน'}
      description={'จัดการห้องเรียน'}
      actions={
        <>
          <ClassCreateAction />
        </>
      }
    >
      <ClassDataTable />
    </PageLayout>
  )
}
