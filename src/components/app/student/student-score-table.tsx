'use client'
import { ScoreAssignCreateAction } from '@/components/app/class/score/action-modal'
import { ScoreInputCell } from '@/components/app/student/actions/score-input-cell'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { useStudentScore } from '@/hooks/app/use-score'
import React from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { ScoreAssign, ScoreAssignDetail } from '@/models'

export default function StudentScoreTable() {
  const { scoreStudent, classMembers, isLoading } = useStudentScore()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">บันทึกคะแนน</h3>
        <ScoreAssignCreateAction />
      </div>
      <div className="overflow-x-auto">
        <Table className="w-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">รหัสนักเรียน</TableHead>
              <TableHead className="w-auto">ชื่อนักเรียน</TableHead>
              {scoreStudent?.data?.map((assign) => (
                <ContextMenu key={assign.id}>
                  <ContextMenuTrigger asChild>
                    <TableHead className="text-center">{assign.name}</TableHead>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>Profile</ContextMenuItem>
                    <ContextMenuItem>Billing</ContextMenuItem>
                    <ContextMenuItem>Team</ContextMenuItem>
                    <ContextMenuItem>สามารถแก้ไขคะแนนได้</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={scoreStudent?.data?.length ?? 0 + 2}
                  className="text-center py-10"
                >
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : (
              <React.Fragment>
                {classMembers?.map((member) => (
                  <TableRow key={member.id} className="border-0">
                    <TableCell>{member.student.code}</TableCell>
                    <TableCell>
                      {member.student.prefix}
                      {member.student.firstName} {member.student.lastName}
                    </TableCell>
                    {scoreStudent?.data?.map((assign) => {
                      const convertedAssign = {
                        ...assign,
                        assignDate: assign.assignDate
                          ? new Date(assign.assignDate)
                          : null,
                        finalDate: assign.finalDate
                          ? new Date(assign.finalDate)
                          : null,
                      }
                      return (
                        <TableCell key={assign.id} className="text-center p-1">
                          <ScoreInputCell
                            studentId={member.studentId}
                            assign={convertedAssign}
                          />
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </React.Fragment>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
