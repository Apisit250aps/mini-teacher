'use client'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import DataTable from '@/components/share/table/data-table'

import { useGetClassMembers } from '@/hooks/queries/use-class'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useCheckQueries } from '@/hooks/queries/use-check'
import { CheckDateCreateAction } from '../class/check/action-modal'
import { useClassContext } from '@/hooks/app/use-class'
import { CHECK_STATUS } from '@/models/entities'
import { ColumnDef } from '@tanstack/react-table'

type StudentCheckTableRow = {
  id: string
  studentId: string
  studentCode: string
  studentName: string
  [key: string]: string
}

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

const CHECK_STATUS_LABEL_MAP = Object.fromEntries(
  CHECK_STATUS_OPTIONS.map((option) => [option.value, option.label]),
) as Record<AttendanceStatus, string>

const CHECK_STATUS_COLOR_MAP = Object.fromEntries(
  CHECK_STATUS_OPTIONS.map((option) => [option.value, option.className]),
) as Record<AttendanceStatus, string>

export default function StudentCheckTable() {
  const memberQuery = useGetClassMembers()
  const checkQueries = useCheckQueries()
  const checkDateQuery = checkQueries.list
  const { activeClass } = useClassContext()
  const { studentCheck } = checkQueries
  const [tableLimit, setTableLimit] = useState(10)

  function roundUpToNearestTen(num: number) {
    return Math.ceil(num / 10) * 10
  }

  const getAttendanceStatus = useCallback(
    (studentId: string, checkDateId: string) => {
      const checkDate = checkDateQuery.data?.find(
        (item) => item.id === checkDateId,
      )
      const checkStudent = (
        checkDate as typeof checkDate & {
          checkStudents?: Array<{ studentId: string; status: string | null }>
        }
      )?.checkStudents?.find((item) => item.studentId === studentId)

      return checkStudent?.status ?? ''
    },
    [checkDateQuery.data],
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
      try {
        await onCheckChange(studentId, checkDateId, status)
        await checkDateQuery.refetch()
      } catch {}
    },
    [onCheckChange, checkDateQuery],
  )

  const mapValueToStatus = useCallback((value?: string) => {
    if (!value) return ''
    return CHECK_STATUS_LABEL_MAP[value as AttendanceStatus] ?? ''
  }, [])

  const getStatusColor = useCallback((value?: string) => {
    if (!value) return ''
    return CHECK_STATUS_COLOR_MAP[value as AttendanceStatus] ?? ''
  }, [])

  const tableData = useMemo<StudentCheckTableRow[]>(() => {
    const checkDates = checkDateQuery.data ?? []

    return (memberQuery.data ?? []).map((member) => {
      const row: StudentCheckTableRow = {
        id: member.id,
        studentId: member.studentId,
        studentCode: member.student.code,
        studentName: `${member.student.prefix}${member.student.firstName} ${member.student.lastName}`,
      }

      checkDates.forEach((checkDate) => {
        row[`check_${checkDate.id}`] = getAttendanceStatus(
          member.studentId,
          checkDate.id,
        )
      })

      return row
    })
  }, [checkDateQuery.data, getAttendanceStatus, memberQuery.data])

  useEffect(() => {
    const nextLimit = roundUpToNearestTen(tableData.length || 10)
    const timer = window.setTimeout(() => {
      setTableLimit((current) => (current === nextLimit ? current : nextLimit))
    }, 0)

    return () => window.clearTimeout(timer)
  }, [tableData.length])

  const columns = useMemo<ColumnDef<StudentCheckTableRow>[]>(() => {
    const baseColumns: ColumnDef<StudentCheckTableRow>[] = [
      {
        accessorKey: 'studentCode',
        header: 'รหัสนักเรียน',
        size: 120,
        cell: ({ row }) => (
          <div className="max-w-20 w-auto truncate">
            {row.original.studentCode}
          </div>
        ),
      },
      {
        accessorKey: 'studentName',
        header: 'ชื่อนักเรียน',
        cell: ({ row }) => (
          <div className="max-w-65 truncate">{row.original.studentName}</div>
        ),
      },
    ]

    const checkDateColumns: ColumnDef<StudentCheckTableRow>[] = (
      checkDateQuery.data ?? []
    ).map((checkDate) => ({
      id: `check_${checkDate.id}`,
      accessorKey: `check_${checkDate.id}`,
      header: checkDate.date,
      size: 72,
      minSize: 64,
      maxSize: 72,
      cell: ({ row }) => {
        const status = row.original[`check_${checkDate.id}`]

        return (
          <div className="w-full max-w-18">
            <ContextMenu>
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
                        row.original.studentId,
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
          </div>
        )
      },
    }))
    return [...baseColumns, ...checkDateColumns]
  }, [
    checkDateQuery.data,
    getStatusColor,
    handleAttendanceChange,
    mapValueToStatus,
  ])

  return (
    <div className="w-full max-w-full min-w-0">
      <div className="flex items-center justify-end">
        <CheckDateCreateAction />
      </div>
      <div className="w-full max-w-full min-w-0 mt-4">
        <DataTable
          columns={columns}
          data={tableData}
          limit={tableLimit}
        />
      </div>
    </div>
  )
}
