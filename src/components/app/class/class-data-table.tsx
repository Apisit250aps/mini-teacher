'use client'
import ClassForm from '@/components/app/class/class-form'
import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import DataTable from '@/components/share/table/data-table'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import type { Class, ClassFormValue } from '@/models/domain'
import { Cell, ColumnDef } from '@tanstack/react-table'
import { Pen, Trash } from 'lucide-react'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'
import { useClassesInYear } from '@/hooks/queries/use-year'
import { useClassQueries } from '@/hooks/queries/use-class'
import { useOverlay } from '@/hooks/contexts/use-overlay'

const ColumnActions = ({ cell }: { cell: Cell<Class, unknown> }) => {
  const { onUpdate, onDelete } = useClassQueries()
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
          value={cell.row.original}
          onSubmit={function (data: ClassFormValue): void {
            onUpdate(cell.row.original.id, {
              id: cell.row.original.id,
              ...data,
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
        onConfirm={() => onDelete(cell.row.original.id).then(() => closeAll())}
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
  const classes = useClassesInYear()

  return (
    <DataTable
      columns={columns}
      data={(classes.data as Class[]) || []}
      isLoading={classes.isPending}
    />
  )
}
