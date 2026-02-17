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
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useCheckQueries } from '@/hooks/queries/use-check'
import { Button } from '@/components/ui/button'
import { CheckDateCreateAction } from '../class/check/action-modal'

export default function StudentCheckTable() {
  const memberQuery = useGetClassMembers()
  const checkDateQuery = useCheckQueries().list
  //
  const [attendanceStatus, setAttendanceStatus] = useState<
    Record<string, string>
  >({})

  const handleAttendanceChange = (memberId: string, status: string) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [memberId]: status,
    }))
  }

  const mapValueToStatus = (value: string) => {
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
              {Array.from(checkDateQuery.data ?? []).map((check, index) => (
                <TableCell className="max-w-17" key={index}>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <Input
                        className={
                          'cursor-pointer text-center' +
                          (attendanceStatus[`${member.id}${check.date}`] ===
                          'PRESENT'
                            ? ' text-green-500'
                            : attendanceStatus[`${member.id}${check.date}`] ===
                                'ABSENT'
                              ? ' text-red-500'
                              : attendanceStatus[
                                    `${member.id}${check.date}`
                                  ] === 'LEAVE'
                                ? ' text-yellow-500'
                                : attendanceStatus[
                                      `${member.id}${check.date}`
                                    ] === 'LATE'
                                  ? ' text-orange-500'
                                  : '')
                        }
                        value={mapValueToStatus(
                          attendanceStatus[`${member.id}${check.date}`],
                        )}
                        readOnly
                      />
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() =>
                          handleAttendanceChange(
                            `${member.id}${check.date}`,
                            'PRESENT',
                          )
                        }
                      >
                        มา
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() =>
                          handleAttendanceChange(
                            `${member.id}${check.date}`,
                            'ABSENT',
                          )
                        }
                      >
                        ขาด
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() =>
                          handleAttendanceChange(
                            `${member.id}${check.date}`,
                            'LEAVE',
                          )
                        }
                      >
                        ลา
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() =>
                          handleAttendanceChange(
                            `${member.id}${check.date}`,
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
