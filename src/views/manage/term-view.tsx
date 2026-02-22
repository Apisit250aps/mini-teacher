import YearDataTable from '@/components/app/year/year-data-table'
import PageLayout from '@/components/layouts/page-layout'
import React from 'react'

export default function TermsView() {
  return (
    <PageLayout title="ภาคเรียน" description="จัดการภาคการศึกษา">
      <YearDataTable />
    </PageLayout>
  )
}
