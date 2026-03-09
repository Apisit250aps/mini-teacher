'use client'
import ClassForm from '@/presentations/components/app/class/class-form'
import type { ClassFormValue } from '@/presentations/components/app/class/class-form'
import { ActionDropdown } from '@/presentations/components/share/overlay/action-dropdown'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
import DataTable from '@/presentations/components/share/table/data-table'
import { DropdownMenuItem } from '@/presentations/components/ui/dropdown-menu'
import type { Class } from '@/core/domain/entities'
import { Cell, ColumnDef } from '@tanstack/react-table'
import { Pen, Trash } from 'lucide-react'
import { ConfirmDialog } from '@/presentations/components/share/overlay/confirm-dialog'
import { useClassMutations } from '@/hooks/queries'
import { useClassContext } from '@/hooks/app/use-class'
import { useOverlay } from '@/hooks/contexts/use-overlay'

const ColumnActions = ({ cell }: { cell: Cell<Class, unknown> }) => {
  const { update, remove } = useClassMutations()
  const { closeAll } = useOverlay()

  return (
    <ActionDropdown id={`CLASS_ACTION_COLUMNS_${cell.row.original.id}`}>
      <ModalDialog
        title={'แก้ไขข้อมูลห้องเรียน'}
        description="คุณสามารถแก้ไขข้อมูลห้องเรียนได้ที่นี่"
        closeOutside={false}
        dialogKey={`CLASS_EDIT_MODAL_${cell.row.original.id}`}
        trigger={
          <DropdownMenuItem>
            <Pen /> แก้ไขข้อมูล
          </DropdownMenuItem>
        }
      >
        <ClassForm
          value={{
            name: cell.row.original.name,
            subject: cell.row.original.subject,
            description: cell.row.original.description,
            year: cell.row.original.yearId,
          }}
          onSubmit={function (data: ClassFormValue): void {
            const { year, ...rest } = data
            update(cell.row.original.id, {
              ...rest,
              yearId: year,
            }).then(() => {
              closeAll()
            })
          }}
        />
      </ModalDialog>
      <ConfirmDialog
        dialogKey={`DELETE_CLASS_CONFIRM_${cell.row.original.id}`}
        trigger={
          <DropdownMenuItem variant="destructive" className="text-destructive">
            <Trash />
            ลบห้องเรียน
          </DropdownMenuItem>
        }
        title="ยืนยันการลบห้องเรียน"
        description="คุณแน่ใจหรือไม่ว่าต้องการลบห้องเรียนนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
        onConfirm={() => remove(cell.row.original.id).then(() => closeAll())}
      />
    </ActionDropdown>
  )
}

const columns: ColumnDef<Class>[] = [
  {
    id: 'name',
    header: 'ชื่อห้องเรียน',
    accessorKey: 'name',
  },
  {
    id: 'subject',
    header: 'วิชา',
    accessorKey: 'subject',
  },
  {
    id: 'description',
    header: 'รายละเอียด',
    accessorKey: 'description',
  },
  {
    header: 'จัดการ',
    cell: ColumnActions,
  },
]

export default function ClassDataTable() {
  const { classes, isLoading } = useClassContext()

  return (
    <DataTable
      columns={columns}
      data={classes as Class[]}
      isLoading={isLoading}
    />
  )
}
