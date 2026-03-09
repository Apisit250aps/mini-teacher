'use client'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/presentations/components/ui/context-menu'
import { useCheckStudentMutations } from '@/hooks/queries'
import { CheckStatus } from '@/core/domain/entities'
import { useMemo, useState } from 'react'

type AttendanceStatus = Exclude<CheckStatus, 'DEFAULT'>

type CheckDateStudentStatus = {
  id?: string
  studentId: string
  status: string | null
}

type CheckDateWithStudents = {
  id: string
  isEditable?: boolean
  checkStudents?: CheckDateStudentStatus[]
}

type CheckStatusCellProps = {
  studentId: string
  checkDate: CheckDateWithStudents
}

const CHECK_STATUS_OPTIONS: Array<{
  value: AttendanceStatus
  label: string
  className: string
}> = [
  {
    value: 'PRESENT',
    label: 'มา',
    className: 'text-green-500 bg-green-500/10',
  },
  {
    value: 'ABSENT',
    label: 'ขาด',
    className: 'text-red-500 bg-red-500/10',
  },
  {
    value: 'LEAVE',
    label: 'ลา',
    className: 'text-yellow-500 bg-yellow-500/10',
  },
  {
    value: 'LATE',
    label: 'สาย',
    className: 'text-orange-500 bg-orange-500/10',
  },
]

const CHECK_STATUS_LABEL_MAP = Object.fromEntries(
  CHECK_STATUS_OPTIONS.map((option) => [option.value, option.label]),
) as Record<AttendanceStatus, string>

const CHECK_STATUS_COLOR_MAP = Object.fromEntries(
  CHECK_STATUS_OPTIONS.map((option) => [option.value, option.className]),
) as Record<AttendanceStatus, string>

const mapValueToStatus = (value?: string) => {
  if (!value) return ''
  return CHECK_STATUS_LABEL_MAP[value as AttendanceStatus] ?? ''
}

const getStatusColor = (value?: string) => {
  if (!value) return ''
  return CHECK_STATUS_COLOR_MAP[value as AttendanceStatus] ?? ''
}

export function CheckStatusCell({
  studentId,
  checkDate,
}: CheckStatusCellProps) {
  const { create, update } = useCheckStudentMutations()
  const [optimisticStatus, setOptimisticStatus] = useState<
    AttendanceStatus | undefined
  >(undefined)

  const serverStatus = useMemo((): AttendanceStatus | '' => {
    const check = checkDate.checkStudents?.find(
      (studentCheckItem) => studentCheckItem.studentId === studentId,
    )
    if (!check?.status) return ''
    return check.status as AttendanceStatus
  }, [checkDate.checkStudents, studentId])

  const status = optimisticStatus ?? serverStatus
  const currentCheck = useMemo(
    () =>
      checkDate.checkStudents?.find(
        (studentCheckItem) => studentCheckItem.studentId === studentId,
      ),
    [checkDate.checkStudents, studentId],
  )
  const isEmptyStatus = !status
  const isPending = false
  const isDisabled = isPending || checkDate.isEditable === false

  const handleAttendanceChange = async (nextStatus: AttendanceStatus) => {
    if (isDisabled) return

    const previousStatus = optimisticStatus
    setOptimisticStatus(nextStatus)

    try {
      if (currentCheck?.id) {
        await update(currentCheck.id, {
          status: nextStatus,
        })
      } else {
        await create({
          checkDateId: checkDate.id,
          studentId,
          status: nextStatus,
        })
      }
      setOptimisticStatus(undefined)
    } catch {
      if (previousStatus) {
        setOptimisticStatus(previousStatus)
      } else {
        setOptimisticStatus(undefined)
      }
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={`h-7 cursor-pointer text-center text-sm leading-7 transition-colors ${isEmptyStatus ? 'text-muted-foreground' : getStatusColor(status)} ${isPending ? 'opacity-70' : ''}`}
        >
          {isEmptyStatus ? 'ว่าง' : mapValueToStatus(status)}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {CHECK_STATUS_OPTIONS.map((option) => (
          <ContextMenuItem
            key={option.value}
            disabled={isDisabled}
            onClick={() => handleAttendanceChange(option.value)}
          >
            {option.label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}
