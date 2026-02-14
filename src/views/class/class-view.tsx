import ClassDataTable from '@/components/app/class/class-data-table'
import PageLayout from '@/components/layouts/page-layout'
import React from 'react'

export default function ClassView() {
  return (
    <PageLayout title={'ห้องเรียน'}>
      <ClassDataTable />
    </PageLayout>
  )
}
