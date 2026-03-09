'use client'

import React, { useMemo } from 'react'
import { CheckStatusCell } from '@/presentations/components/app/student/actions/check-status-cell'
import { CheckDateCreateAction } from '../class/check/action-modal'
import { useClassContext } from '@/hooks/app/use-class'
import {
  useCheckDatesByClassQuery,
  useClassMembersByClassQuery,
} from '@/hooks/queries'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentations/components/ui/table'
import { Spinner } from '@/presentations/components/ui/spinner'

type CheckDateWithStudents = {
  id: string
  date: string | Date
  isEditable?: boolean
  checkStudents?: Array<{
    id?: string
    studentId: string
    status: string | null
  }>
}

const newDate = (date: string | Date) => {
  const d = new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  }).format(new Date(date))
  return d
}

export default function StudentCheckTable() {
  const { activeClass } = useClassContext()
  const classId = activeClass?.id ?? ''
  const checkDatesQuery = useCheckDatesByClassQuery(classId)
  const classMembersQuery = useClassMembersByClassQuery(classId)

  const checkDates = checkDatesQuery.data
  const classMembers = classMembersQuery.data
  const isLoading = checkDatesQuery.isLoading || classMembersQuery.isLoading

  const checkDateList = useMemo(
    () => checkDates as CheckDateWithStudents[],
    [checkDates],
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={checkDateList.length + 2} className="py-10">
                  <div className="flex items-center justify-center">
                    <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              classMembers.map((member) => {
                return (
                  <TableRow key={member.id}>
                    <TableCell>{member.student.code}</TableCell>
                    <TableCell>
                      {member.student.prefix}
                      {member.student.firstName} {member.student.lastName}
                    </TableCell>
                    {checkDateList.map((checkDate) => {
                      return (
                        <TableCell
                          key={checkDate.id}
                          className="text-center p-1"
                        >
                          <CheckStatusCell
                            studentId={member.student.id}
                            checkDate={checkDate}
                          />
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
