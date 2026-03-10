'use client'
import React from 'react'

import ClassDataTable from '@/presentations/components/app/class/table/class-data-table';
import PageLayout from '@/presentations/components/layouts/page-layout'

export default function ClassManageView() {
  return (
    <PageLayout title={'ห้องเรียน'} description={'จัดการห้องเรียน'}>
      <ClassDataTable />
    </PageLayout>
  )
}
