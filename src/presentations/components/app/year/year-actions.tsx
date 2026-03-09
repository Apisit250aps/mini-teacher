import { ConfirmDialog } from '@/presentations/components/share/overlay/confirm-dialog'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import { DropdownMenuItem } from '@/presentations/components/ui/dropdown-menu'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { Pen, Trash } from 'lucide-react'
import YearCreateForm from './year-create-form'
import { useYearMutations } from '@/hooks/queries'
import { YearWithClasses } from '@/core/domain/data'

export const DeleteYearAction = ({ yearId }: { yearId: string }) => {
  const { remove } = useYearMutations()
  const { closeAll } = useOverlay()

  const handleDelete = async () => {
    await remove(yearId)
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

export const EditYearAction = ({ year }: { year: YearWithClasses }) => {
  const { update } = useYearMutations()
  const { closeAll } = useOverlay()

  const handleUpdate = async (data: { year: number; term: number }) => {
    await update(year.id, data).then(() => {
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
          description: year.description,
          isActive: year.isActive,
        }}
        onSubmit={handleUpdate}
      />
    </ModalDialog>
  )
}
