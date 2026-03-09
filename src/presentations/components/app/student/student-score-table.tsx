'use client'
import { ScoreAssignCreateAction } from '@/presentations/components/app/class/score/action-modal'
import { ScoreInputCell } from '@/presentations/components/app/student/actions/score-input-cell'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentations/components/ui/table'
import { Spinner } from '@/presentations/components/ui/spinner'
import { useClassContext } from '@/hooks/app/use-class'
import {
  useClassMembersByClassQuery,
  useScoreAssignsByClassQuery,
} from '@/hooks/queries'
import React from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/presentations/components/ui/context-menu'

export default function StudentScoreTable() {
  const { activeClass } = useClassContext()
  const classId = activeClass?.id ?? ''

  const scoreAssignsQuery = useScoreAssignsByClassQuery(classId)
  const classMembersQuery = useClassMembersByClassQuery(classId)

  const scoreAssigns = scoreAssignsQuery.data
  const classMembers = classMembersQuery.data
  const isLoading = scoreAssignsQuery.isLoading || classMembersQuery.isLoading

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
              {scoreAssigns?.map((assign) => (
                <ContextMenu key={assign.id}>
                  <ContextMenuTrigger asChild>
                    <TableHead className="text-center">
                      {assign.title}
                    </TableHead>
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
                  colSpan={(scoreAssigns?.length ?? 0) + 2}
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
                    {scoreAssigns?.map((assign) => {
                      return (
                        <TableCell key={assign.id} className="text-center p-1">
                          <ScoreInputCell
                            studentId={member.studentId}
                            assign={assign}
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
