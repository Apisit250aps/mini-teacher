'use client'
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

import { useGetClassMembers } from '@/hooks/queries/use-class'
import React, { useCallback } from 'react'
import { useCheckQueries } from '@/hooks/queries/use-check'
import { CheckDateCreateAction } from '../class/check/action-modal'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import { CHECK_STATUS } from '@/models/entities'

export default function StudentCheckTable() {
  const memberQuery = useGetClassMembers()
  const checkQueries = useCheckQueries()
  const checkDateQuery = checkQueries.list
  const { activeClass } = useClassContext()
  const { activeYear } = useYearContext()
  const { studentCheck } = checkQueries

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
      if (!activeYear || !activeClass) return
      await studentCheck.mutateAsync({
        params: {
          path: {
            yearId: activeYear.id,
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
    [activeYear, activeClass, studentCheck],
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

  const mapValueToStatus = (value?: string) => {
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
  }

  const getStatusColor = (value?: string) => {
    switch (value) {
      case 'PRESENT':
        return 'text-green-500'
      case 'ABSENT':
        return 'text-red-500'
      case 'LEAVE':
        return 'text-yellow-500'
      case 'LATE':
        return 'text-orange-500'
      default:
        return ''
    }
  }

  return (
    <div className="w-full max-w-full min-w-0">
      <div className="flex items-center justify-end">
        <CheckDateCreateAction />
      </div>
      <div className="w-full max-w-full min-w-0 overflow-x-auto overflow-hidden">
        <Table className="min-w-max w-full">
          <TableHeader>
            <TableRow>
              <TableHead>รหัสนักเรียน</TableHead>
              <TableHead>ชื่อนักเรียน</TableHead>
              {checkDateQuery.data?.map((d, index) => (
                <TableHead key={index}>{d.date}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberQuery.data?.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="w-10">{member.student.code}</TableCell>
                <TableCell>
                  {member.student.prefix}
                  {member.student.firstName} {member.student.lastName}
                </TableCell>
                {(checkDateQuery.data ?? []).map((check, index) => (
                  <TableCell className="max-w-17" key={index}>
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <div
                          className={`cursor-pointer h-7 text-center text-sm leading-7 ${getStatusColor(getAttendanceStatus(member.studentId, check.id))}`}
                        >
                          {mapValueToStatus(
                            getAttendanceStatus(member.studentId, check.id),
                          )}
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onClick={() =>
                            handleAttendanceChange(
                              member.studentId,
                              check.id,
                              'PRESENT',
                            )
                          }
                        >
                          มา
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() =>
                            handleAttendanceChange(
                              member.studentId,
                              check.id,
                              'ABSENT',
                            )
                          }
                        >
                          ขาด
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() =>
                            handleAttendanceChange(
                              member.studentId,
                              check.id,
                              'LEAVE',
                            )
                          }
                        >
                          ลา
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() =>
                            handleAttendanceChange(
                              member.studentId,
                              check.id,
                              'LATE',
                            )
                          }
                        >
                          สาย
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
