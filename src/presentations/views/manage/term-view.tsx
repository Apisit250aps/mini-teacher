import YearDataTable from '@/presentations/components/app/year/year-data-table'
import PageLayout from '@/presentations/components/layouts/page-layout'
import React from 'react'

export default function TermsView() {
  return (
    <PageLayout title="ภาคเรียน" description="จัดการภาคการศึกษา">
      <YearDataTable />
    </PageLayout>
  )
}
