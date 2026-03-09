'use client'

import { StudentCreateAction } from '@/presentations/components/app/student/student-action'
import { StudentDataTable } from '@/presentations/components/app/student/student-data-table'
import PageLayout from '@/presentations/components/layouts/page-layout'

export default function StudentView() {
  return (
    <PageLayout title={'นักเรียน'} actions={<StudentCreateAction />}>
      <StudentDataTable />
    </PageLayout>
  )
}
