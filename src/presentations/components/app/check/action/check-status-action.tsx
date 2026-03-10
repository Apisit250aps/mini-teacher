'use client'

import { CheckStatus, CheckStudent } from '@/core/domain/entities'
import { useCheckStudentMutations } from '@/hooks/queries'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

const STATUS_CONFIG: Record<
  CheckStatus,
  { label: string; cell: string; menu: string }
> = {
  DEFAULT: {
    label: '-',
    cell: 'text-muted-foreground',
    menu: 'text-muted-foreground',
  },
  PRESENT: {
    label: 'มา',
    cell: 'text-green-500 bg-green-50',
    menu: '',
  },
  ABSENT: {
    label: 'ขาด',
    cell: 'text-red-500 bg-red-50',
    menu: '',
  },
  LATE: {
    label: 'สาย',
    cell: 'text-yellow-500 bg-yellow-50',
    menu: '',
  },
  LEAVE: {
    label: 'ลา',
    cell: 'text-blue-500 bg-blue-50',
    menu: '',
  },
}

const STATUS_OPTIONS: CheckStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'LEAVE']

export type CheckStatusActionProps = {
  checkDateId: string
  studentId: string
  record: CheckStudent | undefined
}

export default function CheckStatusAction({
  checkDateId,
  studentId,
  record,
}: CheckStatusActionProps) {
  const mutations = useCheckStudentMutations()

  const currentStatus: CheckStatus = record?.status ?? 'DEFAULT'
  const cfg = STATUS_CONFIG[currentStatus]

  const handleSelect = async (status: CheckStatus) => {
    if (status === currentStatus) return
    if (record) {
      await mutations.update(record.id, { status })
    } else {
      await mutations.create({ checkDateId, studentId, status })
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={`cursor-pointer select-none absolute inset-0 flex items-center justify-center text-xs font-medium ${cfg.cell}`}
        >
          {cfg.label}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {STATUS_OPTIONS.map((status) => (
          <ContextMenuItem
            key={status}
            className={STATUS_CONFIG[status].menu}
            onSelect={() => handleSelect(status)}
          >
            {STATUS_CONFIG[status].label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}
