'use client'

import { StudentCreateAction } from '@/components/app/student/student-action'
import PageLayout from '@/components/layouts/page-layout'

export default function StudentView() {
  return (
    <PageLayout title={'นักเรียน'} actions={<StudentCreateAction />}>
      StudentView
    </PageLayout>
  )
}
