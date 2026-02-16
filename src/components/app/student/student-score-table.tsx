'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useGetClassMembers } from '@/hooks/queries/use-class'
import { useState } from 'react'

import { Input } from '@/components/ui/input'

export default function StudentScoreTable() {
  const memberQuery = useGetClassMembers()
  const [attendanceStatus, setAttendanceStatus] = useState<
    Record<string, string>
  >({})

  const work = [
    'งานที่ 1',
    'งานที่ 2',
    'งานที่ 3',
    'งานที่ 4',
    'งานที่ 5',
    'งานที่ 6',
    'งานที่ 7',
    'งานที่ 8',
    'งานที่ 9',
    'งานที่ 10',
  ]

  return (
    <div>
      <Table className="w-auto">
        <TableHeader>
          <TableRow>
            <TableHead>รหัสนักเรียน</TableHead>
            <TableHead>ชื่อนักเรียน</TableHead>
            {work.map((w, index) => (
              <TableHead key={index}>{w}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberQuery.data?.data?.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="w-10">{member.student.code}</TableCell>
              <TableCell>
                {member.student.prefix}
                {member.student.firstName} {member.student.lastName}
              </TableCell>
              {work.map((_, index) => (
                <TableCell className="max-w-17" key={index}>
                  <Input
                    className="[&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
                    type="number"
                    min={0}
                    max={10}
                    value={attendanceStatus[`${member.id}${_}`] || ''}
                    onChange={(e) =>
                      setAttendanceStatus({
                        ...attendanceStatus,
                        [`${member.id}${_}`]: e.target.value,
                      })
                    }
                  />
                </TableCell>
              ))}
              <TableCell>
                {work.reduce((sum, _, index) => {
                  const value = parseInt(
                    attendanceStatus[`${member.id}${work[index]}`] || '0',
                    10,
                  )
                  return sum + value
                }, 0)}
                / 100
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
