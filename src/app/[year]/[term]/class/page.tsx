'use client'

import React from 'react'
import Link from 'next/link'
import PageLayout from '@/components/layouts/page-layout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import EmptyPage from '@/components/share/empty/empty-page'
import { Spinner } from '@/components/ui/spinner'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import { useGetClassMembers } from '@/hooks/queries/use-class'
import { useGetClassCheckDates } from '@/hooks/queries/use-check'
import { useGetScoreAssigns } from '@/hooks/queries/use-score'
import type { Class, ClassMemberDetail, ScoreAssign } from '@/models/domain'
import { Album } from 'lucide-react'

type CheckStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE' | null

type CheckDateWithStudents = {
  id: string
  checkStudents?: Array<{
    studentId: string
    status: CheckStatus
  }>
}

type ScoreAssignWithScores = ScoreAssign & {
  scores?: Array<{
    studentId: string
    score: number
  }>
}

type AttendanceSummary = {
  present: number
  absent: number
  late: number
  leave: number
  checked: number
}

type ScoreSummary = {
  total: number
  entries: number
}

const formatPercent = (value: number) => `${value.toFixed(1)}%`

const getCurrentGrade = (averageScore: number, hasScore: boolean) => {
  if (!hasScore) return '-'
  if (averageScore >= 80) return 'A'
  if (averageScore >= 70) return 'B'
  if (averageScore >= 60) return 'C'
  return 'D'
}

export default function Page() {
  const { classes } = useClassContext()
  const { activeYear } = useYearContext()

  const [selectedClassId, setSelectedClassId] = React.useState<string>('')

  React.useEffect(() => {
    if (classes.length === 0) {
      setSelectedClassId('')
      return
    }

    const hasSelectedClass = classes.some((item) => item.id === selectedClassId)
    if (!hasSelectedClass) {
      setSelectedClassId(classes[0].id)
    }
  }, [classes, selectedClassId])

  const membersQuery = useGetClassMembers(selectedClassId)
  const checksQuery = useGetClassCheckDates(selectedClassId)
  const scoreAssignsQuery = useGetScoreAssigns(selectedClassId)

  const selectedClass = React.useMemo<Class | undefined>(() => {
    return classes.find((item) => item.id === selectedClassId)
  }, [classes, selectedClassId])

  const classMembers = React.useMemo<ClassMemberDetail[]>(() => {
    return (membersQuery.data as ClassMemberDetail[] | undefined) ?? []
  }, [membersQuery.data])

  const checkDates = React.useMemo<CheckDateWithStudents[]>(() => {
    return (checksQuery.data as CheckDateWithStudents[] | undefined) ?? []
  }, [checksQuery.data])

  const scoreAssigns = React.useMemo<ScoreAssignWithScores[]>(() => {
    return (scoreAssignsQuery.data as ScoreAssignWithScores[] | undefined) ?? []
  }, [scoreAssignsQuery.data])

  const attendanceByStudent = React.useMemo(() => {
    const summary = new Map<string, AttendanceSummary>()

    for (const member of classMembers) {
      summary.set(member.studentId, {
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
        checked: 0,
      })
    }

    for (const checkDate of checkDates) {
      for (const check of checkDate.checkStudents ?? []) {
        const studentSummary = summary.get(check.studentId)
        if (!studentSummary || !check.status) continue

        studentSummary.checked += 1
        if (check.status === 'PRESENT') studentSummary.present += 1
        if (check.status === 'ABSENT') studentSummary.absent += 1
        if (check.status === 'LATE') studentSummary.late += 1
        if (check.status === 'LEAVE') studentSummary.leave += 1
      }
    }

    return summary
  }, [checkDates, classMembers])

  const scoreByStudent = React.useMemo(() => {
    const summary = new Map<string, ScoreSummary>()

    for (const member of classMembers) {
      summary.set(member.studentId, { total: 0, entries: 0 })
    }

    for (const assign of scoreAssigns) {
      for (const studentScore of assign.scores ?? []) {
        const studentSummary = summary.get(studentScore.studentId)
        if (!studentSummary) continue

        studentSummary.total += studentScore.score
        studentSummary.entries += 1
      }
    }

    return summary
  }, [classMembers, scoreAssigns])

  const totalAssignableScore = React.useMemo(() => {
    return scoreAssigns.reduce((sum, assign) => {
      const maxScore = assign.maxScore > 0 ? assign.maxScore : 100
      return sum + maxScore
    }, 0)
  }, [scoreAssigns])

  const totals = React.useMemo(() => {
    let attendanceFilled = 0
    for (const item of attendanceByStudent.values()) {
      attendanceFilled += item.checked
    }

    let scoreFilled = 0
    let scoreTotal = 0
    for (const item of scoreByStudent.values()) {
      scoreFilled += item.entries
      scoreTotal += item.total
    }

    const attendanceSlots = classMembers.length * checkDates.length
    const scoreSlots = classMembers.length * scoreAssigns.length
    const classFullScore = classMembers.length * totalAssignableScore

    return {
      attendanceSlots,
      attendanceFilled,
      attendanceRate:
        attendanceSlots > 0 ? (attendanceFilled / attendanceSlots) * 100 : 0,
      scoreSlots,
      scoreFilled,
      scoreRate: scoreSlots > 0 ? (scoreFilled / scoreSlots) * 100 : 0,
      averageScore: classFullScore > 0 ? (scoreTotal / classFullScore) * 100 : 0,
    }
  }, [
    attendanceByStudent,
    classMembers.length,
    checkDates.length,
    scoreAssigns.length,
    scoreByStudent,
    totalAssignableScore,
  ])

  const studentRows = React.useMemo(() => {
    return classMembers.map((member) => {
      const attendance = attendanceByStudent.get(member.studentId)
      const score = scoreByStudent.get(member.studentId)
      const attendedCount = (attendance?.present ?? 0) + (attendance?.late ?? 0)

      const attendanceRate =
        checkDates.length > 0
          ? (attendedCount / checkDates.length) * 100
          : 0

      const averageScore =
        totalAssignableScore > 0 ? ((score?.total ?? 0) / totalAssignableScore) * 100 : 0

      const grade = getCurrentGrade(averageScore, totalAssignableScore > 0)

      return {
        id: member.id,
        code: member.student.code,
        fullName: `${member.student.prefix}${member.student.firstName} ${member.student.lastName}`,
        present: attendance?.present ?? 0,
        absent: attendance?.absent ?? 0,
        late: attendance?.late ?? 0,
        leave: attendance?.leave ?? 0,
        attendanceRate,
        averageScore,
        grade,
      }
    })
  }, [
    attendanceByStudent,
    checkDates.length,
    classMembers,
    scoreByStudent,
    totalAssignableScore,
  ])

  const isLoading =
    membersQuery.isPending || checksQuery.isPending || scoreAssignsQuery.isPending

  if (classes.length === 0) {
    return (
      <EmptyPage
        icon={<Album size={48} />}
        title="ยังไม่มีห้องเรียนในภาคเรียนนี้"
        description="เริ่มต้นด้วยการสร้างห้องเรียน เพื่อดูภาพรวมรายภาคเรียน"
        action={
          <Button asChild>
            <Link href={`/${activeYear.year}/${activeYear.term}/class/manage`}>
              สร้างห้องเรียน
            </Link>
          </Button>
        }
      />
    )
  }

  return (
    <PageLayout
      title={`สรุปรายภาคเรียน ${activeYear.term}/${activeYear.year}`}
      description="ภาพรวมการเข้าเรียนและคะแนนของห้องเรียนในภาคเรียนนี้"
      actions={
        <div className="w-64 max-w-full">
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกห้องเรียน" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>ห้องเรียนทั้งหมด</CardDescription>
            <CardTitle>{classes.length} ห้อง</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            ห้องที่เลือก: {selectedClass?.name ?? '-'}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>จำนวนนักเรียน</CardDescription>
            <CardTitle>{classMembers.length} คน</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            วันที่เช็คชื่อ {checkDates.length} ครั้ง
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>ความครบถ้วนการเช็คชื่อ</CardDescription>
            <CardTitle>{formatPercent(totals.attendanceRate)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            บันทึกแล้ว {totals.attendanceFilled}/{totals.attendanceSlots || 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>คะแนนเฉลี่ยรวม</CardDescription>
            <CardTitle>{formatPercent(totals.averageScore)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            เต็มรวม {totalAssignableScore} คะแนน • กรอกแล้ว {totals.scoreFilled}/{totals.scoreSlots || 0}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>สรุปนักเรียนรายคน</CardTitle>
          <CardDescription>
            ดูจำนวนมาเรียน/ขาด/สาย/ลา พร้อมอัตราการเข้าเรียนและคะแนนเฉลี่ย
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัส</TableHead>
                <TableHead>ชื่อนักเรียน</TableHead>
                <TableHead className="text-center">มา</TableHead>
                <TableHead className="text-center">ขาด</TableHead>
                <TableHead className="text-center">สาย</TableHead>
                <TableHead className="text-center">ลา</TableHead>
                <TableHead className="text-right">เข้าเรียน</TableHead>
                <TableHead className="text-right">คะแนนเฉลี่ย</TableHead>
                <TableHead className="text-center">เกรดตอนนี้</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center">
                    <div className="inline-flex items-center gap-2 text-muted-foreground">
                      <Spinner />
                      กำลังโหลดข้อมูล...
                    </div>
                  </TableCell>
                </TableRow>
              ) : studentRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                    ไม่พบข้อมูลนักเรียนในห้องเรียนนี้
                  </TableCell>
                </TableRow>
              ) : (
                studentRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell className="text-center">{row.present}</TableCell>
                    <TableCell className="text-center">{row.absent}</TableCell>
                    <TableCell className="text-center">{row.late}</TableCell>
                    <TableCell className="text-center">{row.leave}</TableCell>
                    <TableCell className="text-right">{formatPercent(row.attendanceRate)}</TableCell>
                    <TableCell className="text-right">{formatPercent(row.averageScore)}</TableCell>
                    <TableCell className="text-center">{row.grade}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
