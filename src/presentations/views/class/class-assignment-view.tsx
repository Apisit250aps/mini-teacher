'use client'

import React from 'react'
import PageLayout from '@/presentations/components/layouts/page-layout'
import AssignmentCreateAction from '@/presentations/components/app/assignment/action/assignment-create-action'
import AssignmentStudentTable from '@/presentations/components/app/assignment/table/assignment-student-table'

export default function ClassAssignmentView() {
  return (
    <PageLayout
      title={'งาน/ข้อสอบ'}
      description={'บันทึกคะแนนงาน/ข้อสอบ'}
      actions={
        <>
          <AssignmentCreateAction />
        </>
      }
    >
      <AssignmentStudentTable />
    </PageLayout>
  )
}
