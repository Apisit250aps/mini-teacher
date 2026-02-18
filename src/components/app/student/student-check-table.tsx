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
import React, { useCallback, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
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
  const [attendanceOverride, setAttendanceOverride] = useState<
    Record<string, string>
  >({})

  const getAttendanceKey = useCallback(
    (studentId: string, checkDateId: string) => `${studentId}-${checkDateId}`,
    [],
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

  const attendanceStatus = useMemo(() => {
    const initialStatus: Record<string, string> = {}
    for (const checkDate of checkDateQuery.data ?? []) {
      const checkStudents = (
        checkDate as typeof checkDate & {
          checkStudents?: Array<{ studentId: string; status: string | null }>
        }
      ).checkStudents

      for (const studentCheckItem of checkStudents ?? []) {
        initialStatus[
          getAttendanceKey(studentCheckItem.studentId, checkDate.id)
        ] = studentCheckItem.status ?? ''
      }
    }

    return {
      ...initialStatus,
      ...attendanceOverride,
    }
  }, [checkDateQuery.data, attendanceOverride, getAttendanceKey])

  const handleAttendanceChange = useCallback(
    async (studentId: string, checkDateId: string, status: CHECK_STATUS | string) => {
      const key = getAttendanceKey(studentId, checkDateId)
      const previousStatus = attendanceStatus[key]

      setAttendanceOverride((prev) => ({
        ...prev,
        [key]: status as string,
      }))

      try {
        await onCheckChange(studentId, checkDateId, status)
      } catch {
        setAttendanceOverride((prev) => ({
          ...prev,
          [key]: previousStatus ?? '',
        }))
      }
    },
    [attendanceStatus, getAttendanceKey, onCheckChange],
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

  return (
    <div>
      <div className="flex items-center justify-end">
        <CheckDateCreateAction />
      </div>
      <Table className="w-auto">
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
                      <Input
                        className={
                          'cursor-pointer text-center' +
                          (attendanceStatus[
                            getAttendanceKey(member.studentId, check.id)
                          ] ===
                          'PRESENT'
                            ? ' text-green-500'
                            : attendanceStatus[
                                  getAttendanceKey(member.studentId, check.id)
                                ] ===
                                'ABSENT'
                              ? ' text-red-500'
                              : attendanceStatus[
                                    getAttendanceKey(member.studentId, check.id)
                                  ] === 'LEAVE'
                                ? ' text-yellow-500'
                                : attendanceStatus[
                                      getAttendanceKey(member.studentId, check.id)
                                    ] === 'LATE'
                                  ? ' text-orange-500'
                                  : '')
                        }
                        value={mapValueToStatus(
                          attendanceStatus[
                            getAttendanceKey(member.studentId, check.id)
                          ],
                        )}
                        readOnly
                      />
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
  )
}
