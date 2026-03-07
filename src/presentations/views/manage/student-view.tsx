'use client'

import { StudentCreateAction } from '@/components/app/student/student-action'
import { StudentDataTable } from '@/components/app/student/student-data-table'
import PageLayout from '@/components/layouts/page-layout'

export default function StudentView() {
  return (
    <PageLayout title={'นักเรียน'} actions={<StudentCreateAction />}>
      <StudentDataTable />
    </PageLayout>
  )
}
