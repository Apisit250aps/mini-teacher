'use client'
import { ScoreAssignCreateAction } from '@/components/app/class/score/action-modal'
import { ScoreInputCell } from '@/components/app/student/score-input-cell'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { useStudentScore } from '@/hooks/app/use-score';


export default function StudentScoreTable() {
  const { scoreAssigns, classMembers, isLoading } = useStudentScore()

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
                <TableHead key={assign.id} className="text-center">
                  {assign.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={scoreAssigns?.length ?? 0 + 2}
                  className="text-center py-10"
                >
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {classMembers?.map((member) => (
                  <TableRow key={member.id} className="border-0">
                    <TableCell>{member.student.code}</TableCell>
                    <TableCell>
                      {member.student.prefix}
                      {member.student.firstName} {member.student.lastName}
                    </TableCell>
                    {scoreAssigns?.map((assign) => (
                      <TableCell
                        key={assign.id}
                        className="text-center"
                      ></TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
