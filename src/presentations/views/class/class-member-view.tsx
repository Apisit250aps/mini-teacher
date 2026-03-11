'use client'
import React from 'react'
import PageLayout from '@/presentations/components/layouts/page-layout'
import ClassMemberDataTable from '@/presentations/components/app/class-member/table/class-member-data-table'
import StudentSelectAction from '@/presentations/components/app/student/action/student-select-action'

export default function ClassMemberView() {
  return (
    <PageLayout
      title={'รายชื่อนักเรียน'}
      description={'รายชื่อนักเรียนในห้องเรียน'}
      actions={<StudentSelectAction />}
    >
      <ClassMemberDataTable />
    </PageLayout>
  )
}
