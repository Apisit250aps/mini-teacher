'use client'
import DataTable from '@/components/share/table/data-table'
import { useStudentScoreTable } from '@/hooks/app/use-score'
import { ScoreAssignCreateAction } from '@/components/app/class/score/action-modal'

export default function StudentScoreTable() {
  const { columns, tableData, isLoading } = useStudentScoreTable()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">บันทึกคะแนน</h3>
        <ScoreAssignCreateAction />
      </div>
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={tableData} isLoading={isLoading} />
      </div>
    </div>
  )
}
