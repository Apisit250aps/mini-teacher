'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { CheckDateCreateAction } from '../class/check/action-modal'
import { useStudentCheck } from '@/hooks/app/use-check'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { useClassContext } from '@/hooks/app/use-class'
import { useCheckQueries } from '@/hooks/queries/use-check'
import { CHECK_STATUS } from '@/models'

type AttendanceStatus = NonNullable<CHECK_STATUS>
type CheckDateStudentStatus = {
  studentId: string
  status: string | null
}

type CheckDateWithStudents = {
  id: string
  date: string
  checkStudents?: CheckDateStudentStatus[]
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

const mapValueToStatus = (value?: string) => {
  if (!value) return ''
  return CHECK_STATUS_LABEL_MAP[value as AttendanceStatus] ?? ''
}

const getStatusColor = (value?: string) => {
  if (!value) return ''
  return CHECK_STATUS_COLOR_MAP[value as AttendanceStatus] ?? ''
}

const CHECK_STATUS_LABEL_MAP = Object.fromEntries(
  CHECK_STATUS_OPTIONS.map((option) => [option.value, option.label]),
) as Record<AttendanceStatus, string>

const CHECK_STATUS_COLOR_MAP = Object.fromEntries(
  CHECK_STATUS_OPTIONS.map((option) => [option.value, option.className]),
) as Record<AttendanceStatus, string>

const newDate = (date: string) => {
  const d = new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  }).format(new Date(date))
  return d
}

export default function StudentCheckTable() {
  const { checkDates, classMembers } = useStudentCheck()
  const checkQueries = useCheckQueries()
  const checkDateQuery = checkQueries.list
  const { activeClass } = useClassContext()
  const { studentCheck } = checkQueries
  const [optimisticStatuses, setOptimisticStatuses] = useState<
    Record<string, AttendanceStatus>
  >({})
  const [pendingCells, setPendingCells] = useState<Record<string, boolean>>({})

  const checkDateList = useMemo(
    () => checkDates as CheckDateWithStudents[],
    [checkDates],
  )

  const getCellKey = useCallback((studentId: string, checkDateId: string) => {
    return `${studentId}:${checkDateId}`
  }, [])

  const getServerStatus = useCallback(
    (
      studentId: string,
      checkDate: CheckDateWithStudents,
    ): AttendanceStatus | '' => {
      const check = checkDate.checkStudents?.find(
        (studentCheckItem) => studentCheckItem.studentId === studentId,
      )
      if (!check?.status) return ''
      return check.status as AttendanceStatus
    },
    [],
  )

  const getCellStatus = useCallback(
    (
      studentId: string,
      checkDate: CheckDateWithStudents,
    ): AttendanceStatus | '' => {
      const key = getCellKey(studentId, checkDate.id)
      return optimisticStatuses[key] ?? getServerStatus(studentId, checkDate)
    },
    [getCellKey, getServerStatus, optimisticStatuses],
  )

  const onCheckChange = useCallback(
    async (
      studentId: string,
      checkDateId: string,
      status: CHECK_STATUS | string,
    ) => {
      if (!activeClass) return
      await studentCheck.mutateAsync({
        params: {
          path: {
            classId: activeClass.id,
            checkDateId,
          },
        },
        body: {
          studentId,
          status: status as string,
        },
      })
    },
    [activeClass, studentCheck],
  )

  const handleAttendanceChange = useCallback(
    async (
      studentId: string,
      checkDateId: string,
      status: CHECK_STATUS | string,
    ) => {
      const key = getCellKey(studentId, checkDateId)
      const previousStatus = optimisticStatuses[key]

      setOptimisticStatuses((prev) => ({
        ...prev,
        [key]: status as AttendanceStatus,
      }))
      setPendingCells((prev) => ({ ...prev, [key]: true }))

      try {
        await onCheckChange(studentId, checkDateId, status)
        void checkDateQuery.refetch().then(() => {
          setOptimisticStatuses((prev) => {
            const next = { ...prev }
            delete next[key]
            return next
          })
        })
      } catch {
        setOptimisticStatuses((prev) => {
          const next = { ...prev }
          if (previousStatus) {
            next[key] = previousStatus
          } else {
            delete next[key]
          }
          return next
        })
      }
      setPendingCells((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    },
    [checkDateQuery, getCellKey, onCheckChange, optimisticStatuses],
  )

  return (
    <div className="w-full max-w-full min-w-0">
      <div className="flex items-center justify-end">
        <CheckDateCreateAction />
      </div>
      <div className="w-full max-w-full min-w-0 mt-4">
        <Table className="w-auto">
          <TableHeader>
            <TableRow className="border-0">
              <TableHead className="w-20">รหัสนักเรียน</TableHead>
              <TableHead className="w-auto">ชื่อนักเรียน</TableHead>
              {checkDateList.map((checkDate) => {
                return (
                  <TableHead key={checkDate.id} className="text-center">
                    {newDate(checkDate.date)}
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {classMembers.map((member) => {
              return (
                <TableRow key={member.id}>
                  <TableCell>{member.student.code}</TableCell>
                  <TableCell>
                    {member.student.prefix}
                    {member.student.firstName} {member.student.lastName}
                  </TableCell>
                  {checkDateList.map((checkDate) => {
                    const cellKey = getCellKey(member.student.id, checkDate.id)
                    const status = getCellStatus(member.student.id, checkDate)
                    const isCellPending = !!pendingCells[cellKey]

                    return (
                      <ContextMenu key={checkDate.id}>
                        <ContextMenuTrigger>
                          <div
                            className={`h-7 cursor-pointer text-center text-sm leading-7 transition-colors ${getStatusColor(status)} ${isCellPending ? 'opacity-70' : ''}`}
                          >
                            {mapValueToStatus(status)}
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          {CHECK_STATUS_OPTIONS.map((option) => (
                            <ContextMenuItem
                              key={option.value}
                              disabled={isCellPending}
                              onClick={() =>
                                handleAttendanceChange(
                                  member.student.id,
                                  checkDate.id,
                                  option.value,
                                )
                              }
                            >
                              {option.label}
                            </ContextMenuItem>
                          ))}
                        </ContextMenuContent>
                      </ContextMenu>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
