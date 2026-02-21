'use client'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import DataTable from '@/components/share/table/data-table'

import { useGetClassMembers } from '@/hooks/queries/use-class'
import React, { useCallback, useMemo } from 'react'
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

export default function StudentCheckTable() {
  const memberQuery = useGetClassMembers()
  const checkQueries = useCheckQueries()
  const checkDateQuery = checkQueries.list
  const { activeClass } = useClassContext()
  const { studentCheck } = checkQueries

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
    switch (value) {
      case 'PRESENT':
        return 'มา'
      case 'ABSENT':
        return 'ขาด'
      case 'LEAVE':
        return 'ลา'
      case 'LATE':
        return 'สาย'
      default:
        return ''
    }
  }, [])

  const getStatusColor = useCallback((value?: string) => {
    switch (value) {
      case 'PRESENT':
        return 'text-green-500 bg-green-500/10'
      case 'ABSENT':
        return 'text-red-500 bg-red-500/10'
      case 'LEAVE':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'LATE':
        return 'text-orange-500 bg-orange-500/10'
      default:
        return ''
    }
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

  const columns = useMemo<ColumnDef<StudentCheckTableRow>[]>(() => {
    const baseColumns: ColumnDef<StudentCheckTableRow>[] = [
      {
        accessorKey: 'studentCode',
        header: 'รหัสนักเรียน',
      },
      {
        accessorKey: 'studentName',
        header: 'ชื่อนักเรียน',
      },
    ]

    const checkDateColumns: ColumnDef<StudentCheckTableRow>[] = (
      checkDateQuery.data ?? []
    ).map((checkDate) => ({
      id: `check_${checkDate.id}`,
      accessorKey: `check_${checkDate.id}`,
      header: checkDate.date,
      cell: ({ row }) => {
        const status = row.original[`check_${checkDate.id}`]

        return (
          <div className="max-w-17">
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  className={`h-7 cursor-pointer text-center text-sm leading-7 ${getStatusColor(status)}`}
                >
                  {mapValueToStatus(status)}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() =>
                    handleAttendanceChange(
                      row.original.studentId,
                      checkDate.id,
                      'PRESENT',
                    )
                  }
                >
                  มา
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() =>
                    handleAttendanceChange(
                      row.original.studentId,
                      checkDate.id,
                      'ABSENT',
                    )
                  }
                >
                  ขาด
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() =>
                    handleAttendanceChange(
                      row.original.studentId,
                      checkDate.id,
                      'LEAVE',
                    )
                  }
                >
                  ลา
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() =>
                    handleAttendanceChange(
                      row.original.studentId,
                      checkDate.id,
                      'LATE',
                    )
                  }
                >
                  สาย
                </ContextMenuItem>
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
        <DataTable columns={columns} data={tableData} limit={roundUpToNearestTen(tableData.length)} />
      </div>
    </div>
  )
}
