'use client'

import StudentCreateAction from '@/presentations/components/app/student/action/student-create-action'
import StudentDataTable from '@/presentations/components/app/student/table/student-data-table'
import PageLayout from '@/presentations/components/layouts/page-layout'

export default function StudentManageView() {
  return (
    <PageLayout
      title={'นักเรียน'}
      description={'จัดการข้อมูลนักเรียน'}
      actions={<StudentCreateAction />}
    >
      <StudentDataTable />
    </PageLayout>
  )
}
