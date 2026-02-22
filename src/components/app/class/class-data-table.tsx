'use client'
import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import DataTable from '@/components/share/table/data-table'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useClassContext } from '@/hooks/app/use-class'
import { Class, ClassFormValue } from '@/models/entities'
import { Cell, ColumnDef } from '@tanstack/react-table'
import { Pen, Trash } from 'lucide-react'
import ClassForm from '@/components/app/class/class-form'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'
import { useClassesInYear } from '@/hooks/queries/use-year';

const ColumnActions = ({ cell }: { cell: Cell<Class, unknown> }) => {
  const { onClassUpdate, onClassDelete } = useClassContext()

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
            onClassUpdate(cell.row.original.id, data)
          }}
        />
      </ModalDialog>
      <ConfirmDialog
        dialogKey="DELETE_CLASS_CONFIRM"
        trigger={
          <DropdownMenuItem variant="destructive" className="text-destructive">
            <Trash />
            ลบห้องเรียน
          </DropdownMenuItem>
        }
        title="ยืนยันการลบห้องเรียน"
        description="คุณแน่ใจหรือไม่ว่าต้องการลบห้องเรียนนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
        onConfirm={() => onClassDelete(cell.row.original.id)}
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
    header: 'จัดการ',
    cell: ColumnActions,
  },
]

export default function ClassDataTable() {
  const classes = useClassesInYear()

  return <DataTable columns={columns} data={classes.data || []} isLoading={classes.isPending} />
}
