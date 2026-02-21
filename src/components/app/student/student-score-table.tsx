'use client'
import { useStudentScoreTable } from '@/hooks/app/use-score'
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

export default function StudentScoreTable() {
  const { scoreAssigns, tableData, isLoading, setDraftScore, onScoreChange } =
    useStudentScoreTable()

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
              <TableHead>รหัสนักเรียน</TableHead>
              <TableHead>ชื่อนักเรียน</TableHead>
              {scoreAssigns.map((assign) => (
                <TableHead key={assign.id} className="min-w-32">
                  {assign.name}
                </TableHead>
              ))}
              <TableHead>รวม</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={scoreAssigns.length + 3}
                  className="h-10 text-center"
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Spinner data-icon="inline-start" />
                    กำลังโหลด...
                  </div>
                </TableCell>
              </TableRow>
            ) : tableData.length ? (
              tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="w-20">{row.studentCode}</TableCell>
                  <TableCell className="min-w-40">{row.studentName}</TableCell>
                  {scoreAssigns.map((assign) => (
                    <TableCell key={`${row.id}_${assign.id}`} className="w-24">
                      <ScoreInputCell
                        value={row[`score_${assign.id}`] ?? ''}
                        minScore={assign.minScore}
                        maxScore={assign.maxScore}
                        onDraftChange={(value) => {
                          setDraftScore(row.studentId, assign.id, value)
                        }}
                        onCommit={async (safeScore) => {
                          await onScoreChange(
                            row.memberId,
                            row.studentId,
                            assign.id,
                            safeScore,
                          )
                        }}
                      />
                    </TableCell>
                  ))}
                  <TableCell className="font-semibold">
                    {scoreAssigns.reduce((sum, assign) => {
                      const score = row[`score_${assign.id}`]
                      if (typeof score === 'number') return sum + score
                      return sum + (parseInt(score as string, 10) || 0)
                    }, 0)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={scoreAssigns.length + 3} className="text-center">
                  ไม่มีข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
