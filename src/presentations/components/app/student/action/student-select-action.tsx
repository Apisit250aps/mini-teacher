'use client'

import React from 'react'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import {
  useClassMemberMutations,
  useClassMembersByClassQuery,
  useStudentsByTeacherQuery,
} from '@/hooks/queries'
import { useYearContext } from '@/hooks/app/use-year'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import DataTable from '@/presentations/components/share/table/data-table'
import { Button } from '@/presentations/components/ui/button'
import { studentSelectColumns } from '../table/student-data-select-columns'
import { useParams } from 'next/navigation'

const DIALOG = 'STUDENT_SELECT_DIALOG'

export default function StudentSelectAction() {
  const params = useParams<{ classId: string }>()
  const { teacher } = useYearContext()
  const { closeOverlay } = useOverlay()
  const query = useStudentsByTeacherQuery(teacher)
  const { create: addMember } = useClassMemberMutations()
  const { data: members } = useClassMembersByClassQuery(params.classId)

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const tableProps = React.useMemo(() => {
    const existingIds = members?.map((m) => m.studentId) || []
    return {
      data: query.data.filter((s) => !existingIds.includes(s.id)),
      columns: studentSelectColumns,
      isLoading: query.isLoading,
    }
  }, [query.data, query.isLoading, members])

  const handleSubmit = async () => {
    if (selectedIds.length === 0) return
    setIsSubmitting(true)
    try {
      await Promise.all(
        selectedIds.map((studentId) =>
          addMember({ classId: params.classId, studentId }),
        ),
      )
      setSelectedIds([])
      closeOverlay(DIALOG)
    } catch {
      // Handle error (e.g., show notification)
    }
    setIsSubmitting(false)
  }

  return (
    <ModalDialog
      size="xl"
      dialogKey={DIALOG}
      title="เลือกนักเรียน"
      description="กรุณาเลือกนักเรียนจากรายการด้านล่าง"
      trigger={<Button>เพิ่มนักเรียน</Button>}
    >
      <div className="">
        <DataTable
          {...tableProps}
          value={selectedIds}
          onChange={setSelectedIds}
          filterCols={['code', 'firstName', 'lastName']}
        />
      </div>
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-muted-foreground">
          เลือกแล้ว {selectedIds.length} คน
        </span>
        <Button
          onClick={handleSubmit}
          disabled={selectedIds.length === 0 || isSubmitting}
        >
          {isSubmitting
            ? 'กำลังเพิ่ม...'
            : `เพิ่ม ${selectedIds.length > 0 ? `(${selectedIds.length})` : ''} คน`}
        </Button>
      </div>
    </ModalDialog>
  )
}
