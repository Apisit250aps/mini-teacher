'use client'

import React, { useCallback, useState } from 'react'
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
import { useGetClassMembers } from '@/hooks/queries/use-class'
import { CHECK_STATUS } from '@/models'

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LEAVE' | 'LATE'

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
      try {
        await onCheckChange(studentId, checkDateId, status)
        await checkDateQuery.refetch()
      } catch {}
    },
    [onCheckChange, checkDateQuery],
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
              {checkDates.map((checkDate) => {
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
                  {checkDates.map((checkDate) => {
                    return (
                      <ContextMenu key={checkDate.id}>
                        <ContextMenuTrigger>
                          <div
                            className={`h-7 cursor-pointer text-center text-sm leading-7 ${getStatusColor(status)}`}
                          >
                            {mapValueToStatus(status)}
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          {CHECK_STATUS_OPTIONS.map((option) => (
                            <ContextMenuItem
                              key={option.value}
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
