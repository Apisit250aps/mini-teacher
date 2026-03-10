'use client'
import React from 'react'
import PageLayout from '@/presentations/components/layouts/page-layout'
import CheckCreateAction from '@/presentations/components/app/check/action/check-create-action'
import CheckStudentTable from '@/presentations/components/app/check/table/check-student-table';

export default function ClassCheckView() {
  return (
    <PageLayout
      title={'เช็คชื่อการเข้าเรียน'}
      description={'เช็คชื่อการเข้าเรียน'}
      actions={
        <>
          <CheckCreateAction />
        </>
      }
    >
      <CheckStudentTable />
    </PageLayout>
  )
}
