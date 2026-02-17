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

export default function StudentCheckTable() {
  const memberQuery = useGetClassMembers()
  const [attendanceStatus, setAttendanceStatus] = useState<
    Record<string, string>
  >({})

  const handleAttendanceChange = (memberId: string, status: string) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [memberId]: status,
    }))
  }

  const date = [
    '1 กพ.',
    '2 กพ.',
    '3 กพ.',
    '4 กพ.',
    '5 กพ.',
    '6 กพ.',
    '7 กพ.',
    '8 กพ.',
    '9 กพ.',
    '10 กพ.',
  ]

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
      <Table className="w-auto">
        <TableHeader>
          <TableRow>
            <TableHead>รหัสนักเรียน</TableHead>
            <TableHead>ชื่อนักเรียน</TableHead>
            {date.map((d, index) => (
              <TableHead key={index}>{d}</TableHead>
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
              {Array.from(date).map((_, index) => (
                <TableCell className="max-w-17" key={index}>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <Input
                        className={
                          'cursor-pointer text-center' +
                          (attendanceStatus[`${member.id}${_}`] === 'PRESENT'
                            ? ' text-green-500'
                            : attendanceStatus[`${member.id}${_}`] === 'ABSENT'
                              ? ' text-red-500'
                              : attendanceStatus[`${member.id}${_}`] === 'LEAVE'
                                ? ' text-yellow-500'
                                : attendanceStatus[`${member.id}${_}`] ===
                                    'LATE'
                                  ? ' text-orange-500'
                                  : '')
                        }
                        value={mapValueToStatus(
                          attendanceStatus[`${member.id}${_}`],
                        )}
                        readOnly
                      />
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() =>
                          handleAttendanceChange(`${member.id}${_}`, 'PRESENT')
                        }
                      >
                        มา
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() =>
                          handleAttendanceChange(`${member.id}${_}`, 'ABSENT')
                        }
                      >
                        ขาด
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() =>
                          handleAttendanceChange(`${member.id}${_}`, 'LEAVE')
                        }
                      >
                        ลา
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() =>
                          handleAttendanceChange(`${member.id}${_}`, 'LATE')
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
