'use client'
import ClassDataTable from '@/components/app/class/class-data-table'
import ClassForm from '@/components/app/class/class-form'
import PageLayout from '@/components/layouts/page-layout'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { Button } from '@/components/ui/button'
import { useYearContext } from '@/hooks/app/use-year'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useClassQueries } from '@/hooks/queries/use-class'
import React from 'react'

export default function ClassView() {
  const { activeYear } = useYearContext()
  const { onCreate } = useClassQueries()
  const { closeAll } = useOverlay()

  return (
    <PageLayout
      title={'ห้องเรียน'}
      actions={
        <>
          <ModalDialog
            title={`เพิ่มห้องเรียนใหม่ ในปีการศึกษา ${activeYear.term}/${activeYear?.year}`}
            dialogKey="CREATE_CLASS"
            trigger={
              <Button aria-controls="radix-_R_4matpet9et5ritllb_">
                สร้างห้องเรียน
              </Button>
            }
          >
            <ClassForm
              onSubmit={(data) => onCreate(data).then(() => closeAll())}
            />
          </ModalDialog>
        </>
      }
    >
      <ClassDataTable />
    </PageLayout>
  )
}
