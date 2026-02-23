import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useYearQueries } from '@/hooks/queries/use-year'
import { Pen, Trash } from 'lucide-react'
import YearCreateForm from './year-create-form'
import type { YearDetail } from '@/models/domain'

export const DeleteYearAction = ({ yearId }: { yearId: string }) => {
  const { onRemove } = useYearQueries()
  const { closeAll } = useOverlay()

  const handleDelete = async () => {
    await onRemove(yearId)
    closeAll()
  }

  return (
    <ConfirmDialog
      dialogKey={`DELETE_YEAR_${yearId}`}
      trigger={
        <DropdownMenuItem variant="destructive" className="text-destructive">
          <Trash />
          ลบ
        </DropdownMenuItem>
      }
      title="ยืนยันการลบปีการศึกษา"
      description="คุณแน่ใจหรือไม่ว่าต้องการลบปีการศึกษานี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
      onConfirm={() => handleDelete()}
    />
  )
}

export const EditYearAction = ({ year }: { year: YearDetail }) => {
  const { onUpdate } = useYearQueries()
  const { closeAll } = useOverlay()

  const handleUpdate = async (data: { year: number; term: number }) => {
    await onUpdate(year.id, data).then(() => {
      closeAll()
    })
  }
  return (
    <ModalDialog
      title={'แก้ไขปีการศึกษา'}
      description="คุณสามารถแก้ไขข้อมูลปีการศึกษาได้ที่นี่"
      dialogKey={`EDIT_YEAR_${year.id}`}
      closeOutside={false}
      trigger={
        <DropdownMenuItem>
          <Pen />
          แก้ไขข้อมูล
        </DropdownMenuItem>
      }
    >
      <YearCreateForm
        value={{
          year: year.year,
          term: year.term,
        }}
        onSubmit={handleUpdate}
      />
    </ModalDialog>
  )
}
