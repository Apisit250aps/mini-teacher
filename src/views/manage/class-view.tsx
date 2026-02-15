'use client'
import ClassDataTable from '@/components/app/class/class-data-table'
import ClassForm from '@/components/app/class/class-form'
import PageLayout from '@/components/layouts/page-layout'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { Button } from '@/components/ui/button'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import React from 'react'

export default function ClassView() {
  const { activeYear } = useYearContext()
  const { onClassCreate } = useClassContext()

  return (
    <PageLayout
      title={'ห้องเรียน'}
      actions={
        <>
          <ModalDialog
            title={`เพิ่มห้องเรียนใหม่ ในปีการศึกษา ${activeYear.term}/${activeYear?.year}`}
            dialogKey="CREATE_CLASS"
            trigger={<Button>สร้างห้องเรียน</Button>}
          >
            <ClassForm onSubmit={onClassCreate} />
          </ModalDialog>
        </>
      }
    >
      <ClassDataTable />
    </PageLayout>
  )
}
