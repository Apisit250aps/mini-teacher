'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Input } from '@/components/ui/input'
import { useStudentScoreTable } from '@/hooks/app/use-score'
import { Spinner } from '@/components/ui/spinner'
import { ScoreAssignCreateAction } from '@/components/app/class/score/action-modal'

export default function StudentScoreTable() {
  const { tableData, isLoading, onScoreChange } = useStudentScoreTable()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner />
      </div>
    )
  }

  // Extract score assignments from first row (if exists)
  const scoreAssignIds = tableData.length > 0
    ? Object.keys(tableData[0])
        .filter((key) => key.startsWith('score_'))
        .map((key) => key.replace('score_', ''))
    : []

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
            {scoreAssignIds.map((assignId) => (
              <TableHead key={assignId} className="min-w-32">
                {tableData[0]?.[`assign_${assignId}`] as string || 'งาน'}
              </TableHead>
            ))}
            <TableHead>รวม</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="w-20">{row.studentCode}</TableCell>
              <TableCell className="min-w-40">{row.studentName}</TableCell>
              {scoreAssignIds.map((assignId) => (
                <TableCell key={`${row.id}_${assignId}`} className="w-24">
                  <Input
                    className="[&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
                    type="number"
                    min={0}
                    max={100}
                    value={row[`score_${assignId}`] || ''}
                    onChange={(e) => {
                      const score = e.target.value
                        ? parseInt(e.target.value, 10)
                        : 0
                      onScoreChange(
                        row.memberId,
                        row.studentId,
                        assignId,
                        score,
                      )
                    }}
                  />
                </TableCell>
              ))}
              <TableCell className="font-semibold">
                {scoreAssignIds.reduce((sum, assignId) => {
                  const score = row[`score_${assignId}`]
                  return (
                    sum +
                    (typeof score === 'number' ? score : parseInt(score as string) || 0)
                  )
                }, 0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}
