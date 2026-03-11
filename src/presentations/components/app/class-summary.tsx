'use client'

import {
  useClassByIdQuery,
  useClassMembersByClassQuery,
  useCheckDatesByClassQuery,
  useScoreAssignsByClassQuery,
} from '@/hooks/queries'
import React, { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentations/components/ui/card'
import DataTable from '@/presentations/components/share/table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import {
  IconUsers,
  IconListCheck,
  IconCalendarCheck,
  IconChartBar,
} from '@tabler/icons-react'

// ---------------------------------------------------------------------------
// Grade configuration — exported so callers can override in the future
// ---------------------------------------------------------------------------
export type GradeThreshold = { grade: string; min: number }

export const DEFAULT_GRADE_THRESHOLDS: GradeThreshold[] = [
  { grade: 'A', min: 80 },
  { grade: 'B+', min: 75 },
  { grade: 'B', min: 70 },
  { grade: 'C+', min: 65 },
  { grade: 'C', min: 60 },
  { grade: 'D+', min: 55 },
  { grade: 'D', min: 50 },
  { grade: 'F', min: 0 },
]

function computeGrade(
  percentage: number | null,
  thresholds: GradeThreshold[],
): string {
  if (percentage === null) return 'I'
  const sorted = [...thresholds].sort((a, b) => b.min - a.min)
  for (const t of sorted) {
    if (percentage >= t.min) return t.grade
  }
  return 'F'
}

// ---------------------------------------------------------------------------
// Row type
// ---------------------------------------------------------------------------
type StudentSummaryRow = {
  id: string
  code: string
  prefix?: string | null
  firstName: string
  lastName: string
  present: number
  absent: number
  late: number
  leave: number
  earnedScore: number
  maxScore: number
  percentage: number | null
  grade: string
}

const GRADE_COLOR: Record<string, string> = {
  A: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400',
  'B+': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800/20 dark:text-emerald-400',
  B: 'bg-teal-100 text-teal-800 dark:bg-teal-800/20 dark:text-teal-400',
  'C+': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700/20 dark:text-yellow-400',
  C: 'bg-amber-100 text-amber-800 dark:bg-amber-700/20 dark:text-amber-400',
  'D+': 'bg-orange-100 text-orange-800 dark:bg-orange-700/20 dark:text-orange-400',
  D: 'bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-400',
  F: 'bg-red-200 text-red-900 dark:bg-red-900/20 dark:text-red-300',
  I: 'bg-muted text-muted-foreground',
}

function buildColumns(
  gradeThresholds: GradeThreshold[],
): ColumnDef<StudentSummaryRow>[] {
  return [
    {
      accessorKey: 'code',
      header: 'รหัส',
      size: 90,
    },
    {
      accessorKey: 'firstName',
      header: 'ชื่อ-นามสกุล',
      size: 200,
      cell: ({ row }) => {
        const { prefix, firstName, lastName } = row.original
        return (
          <span>
            {prefix}
            {firstName} {lastName}
          </span>
        )
      },
    },
    {
      accessorKey: 'present',
      header: 'มา',
      size: 55,
      meta: { className: 'text-center' },
      cell: ({ row }) => (
        <span className="font-medium text-green-600">
          {row.original.present}
        </span>
      ),
    },
    {
      accessorKey: 'absent',
      header: 'ขาด',
      size: 55,
      meta: { className: 'text-center' },
      cell: ({ row }) => (
        <span className="font-medium text-red-600">{row.original.absent}</span>
      ),
    },
    {
      accessorKey: 'late',
      header: 'สาย',
      size: 55,
      meta: { className: 'text-center' },
      cell: ({ row }) => (
        <span className="font-medium text-amber-600">{row.original.late}</span>
      ),
    },
    {
      accessorKey: 'leave',
      header: 'ลา',
      size: 55,
      meta: { className: 'text-center' },
      cell: ({ row }) => (
        <span className="font-medium text-blue-600">{row.original.leave}</span>
      ),
    },
    {
      accessorKey: 'earnedScore',
      header: 'คะแนน',
      size: 100,
      meta: { className: 'text-center' },
      cell: ({ row }) => {
        const { earnedScore, maxScore } = row.original
        if (maxScore === 0)
          return <span className="text-muted-foreground">-</span>
        return (
          <span>
            {earnedScore}
            <span className="text-xs text-muted-foreground">/{maxScore}</span>
          </span>
        )
      },
    },
    {
      accessorKey: 'percentage',
      header: '%',
      size: 75,
      meta: { className: 'text-center' },
      cell: ({ row }) => {
        const pct = row.original.percentage
        if (pct === null)
          return <span className="text-muted-foreground">-</span>
        return <span>{pct.toFixed(1)}%</span>
      },
    },
    {
      accessorKey: 'grade',
      header: 'เกรด',
      size: 65,
      meta: { className: 'text-center' },
      cell: ({ row }) => {
        const grade = row.original.grade
        void gradeThresholds // used for memoization key
        return (
          <span
            className={`inline-flex items-center justify-center rounded px-2 py-0.5 text-xs font-bold ${GRADE_COLOR[grade] ?? ''}`}
          >
            {grade}
          </span>
        )
      },
    },
  ]
}

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------
type StatCardProps = {
  icon: React.ReactNode
  label: string
  value: string | number
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-lg bg-muted p-2">{icon}</div>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold leading-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// ClassSummary
// ---------------------------------------------------------------------------
export type ClassSummaryProps = {
  classId: string
  gradeThresholds?: GradeThreshold[]
}

export default function ClassSummary({
  classId,
  gradeThresholds = DEFAULT_GRADE_THRESHOLDS,
}: ClassSummaryProps) {
  const { data: classData, isLoading: classLoading } =
    useClassByIdQuery(classId)
  const { data: members, isLoading: membersLoading } =
    useClassMembersByClassQuery(classId)
  const { data: checks, isLoading: checksLoading } =
    useCheckDatesByClassQuery(classId)
  const { data: assignments, isLoading: assignmentsLoading } =
    useScoreAssignsByClassQuery(classId)

  const isLoading =
    classLoading || membersLoading || checksLoading || assignmentsLoading

  // --- Overview stats ---
  const stats = useMemo(() => {
    const studentCount = members?.length ?? 0
    const assignCount = assignments?.length ?? 0
    const checkCount = checks?.length ?? 0
    const totalPairs = studentCount * checkCount
    let checkedPairs = 0
    for (const check of checks ?? []) {
      checkedPairs += check.checkStudents.filter(
        (cs) => cs.status !== 'DEFAULT',
      ).length
    }
    const checkProgress =
      totalPairs > 0 ? Math.round((checkedPairs / totalPairs) * 100) : 0
    return { studentCount, assignCount, checkCount, checkProgress }
  }, [members, assignments, checks])

  // Total max score across all assignments
  const totalMaxScore = useMemo(
    () => (assignments ?? []).reduce((s, a) => s + a.maxScore, 0),
    [assignments],
  )

  // --- Build summary rows ---
  const rows = useMemo<StudentSummaryRow[]>(() => {
    if (!members || !checks || !assignments) return []
    return members.map(({ student }) => {
      // Attendance counts
      let present = 0,
        absent = 0,
        late = 0,
        leave = 0
      for (const check of checks) {
        const r = check.checkStudents.find((cs) => cs.studentId === student.id)
        if (!r) continue
        if (r.status === 'PRESENT') present++
        else if (r.status === 'ABSENT') absent++
        else if (r.status === 'LATE') late++
        else if (r.status === 'LEAVE') leave++
      }

      // Score calculation
      let earnedScore = 0
      let hasAnyScore = false
      for (const assignment of assignments) {
        const score = assignment.scores.find((s) => s.studentId === student.id)
        if (score !== undefined) {
          earnedScore += score.score
          hasAnyScore = true
        }
      }

      // percentage is null when no scores recorded → grade "I" (Incomplete)
      const percentage =
        totalMaxScore > 0 && hasAnyScore
          ? (earnedScore / totalMaxScore) * 100
          : null

      return {
        id: student.id,
        code: student.code,
        prefix: student.prefix,
        firstName: student.firstName,
        lastName: student.lastName,
        present,
        absent,
        late,
        leave,
        earnedScore,
        maxScore: totalMaxScore,
        percentage,
        grade: computeGrade(percentage, gradeThresholds),
      }
    })
  }, [members, checks, assignments, totalMaxScore, gradeThresholds])

  const columns = useMemo(
    () => buildColumns(gradeThresholds),
    [gradeThresholds],
  )

  const table = useMemo(
    () => ({ columns, data: rows, isLoading, autoWidth: false }),
    [columns, rows, isLoading],
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<IconUsers size={18} className="text-blue-600" />}
          label="จำนวนนักเรียน"
          value={isLoading ? '...' : stats.studentCount}
        />
        <StatCard
          icon={<IconListCheck size={18} className="text-purple-600" />}
          label="จำนวนงาน"
          value={isLoading ? '...' : stats.assignCount}
        />
        <StatCard
          icon={<IconCalendarCheck size={18} className="text-teal-600" />}
          label="จำนวนการเช็ค"
          value={isLoading ? '...' : stats.checkCount}
        />
        <StatCard
          icon={<IconChartBar size={18} className="text-amber-600" />}
          label="ความคืบหน้าการเช็ค"
          value={isLoading ? '...' : `${stats.checkProgress}%`}
        />
      </div>

      {/* Summary table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            สรุปผลนักเรียนในห้อง
          </CardTitle>
          <CardDescription>
            {(classData?.name || classData?.subject) && (
              <div className="flex flex-col gap-0.5">
                {classData?.name && (
                  <h2 className="text-md font-bold leading-tight">
                    {classData.name}
                  </h2>
                )}
                {classData?.subject && (
                  <p className="text-sm text-muted-foreground">
                    {classData.subject}
                  </p>
                )}
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto px-5">
          <DataTable {...table} filterCols={['code', 'firstName']} />
        </CardContent>
      </Card>
    </div>
  )
}
