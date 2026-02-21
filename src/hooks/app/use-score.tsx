'use client'

import { useCallback, useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useGetClassMembers } from '@/hooks/queries/use-class'
import { useScoreQueries } from '@/hooks/queries/use-score'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import { Input } from '@/components/ui/input'

type StudentScoreTableRow = {
  id: string
  memberId: string
  studentId: string
  studentCode: string
  studentName: string
  [key: string]: string | number
}

type UseStudentScoreTableResult = {
  columns: ColumnDef<StudentScoreTableRow>[]
  tableData: StudentScoreTableRow[]
  isLoading: boolean
  onScoreChange: (
    memberId: string,
    studentId: string,
    scoreAssignId: string,
    score: number,
  ) => Promise<void>
}

export function useStudentScoreTable(): UseStudentScoreTableResult {
  const memberQuery = useGetClassMembers()
  const scoreQueries = useScoreQueries()
  const { activeClass } = useClassContext()
  const { activeYear } = useYearContext()
  const scoreListQuery = scoreQueries.list
  const { scoreStudent } = scoreQueries
  const [scoreChanges, setScoreChanges] = useState<Record<string, number>>({})

  const getStudentScore = useCallback(
    (studentId: string, scoreAssignId: string) => {
      const scoreAssign = scoreListQuery.data?.find(
        (item) => item.id === scoreAssignId,
      )
      const scoreData = (
        scoreAssign as typeof scoreAssign & {
          scores?: Array<{ studentId: string; score: number }>
        }
      )?.scores?.find((item) => item.studentId === studentId)

      return scoreData?.score ?? scoreChanges[`${studentId}_${scoreAssignId}`] ?? ''
    },
    [scoreListQuery.data, scoreChanges],
  )

  const onScoreChange = useCallback(
    async (
      memberId: string,
      studentId: string,
      scoreAssignId: string,
      score: number,
    ) => {
      if (!activeClass || !activeYear) return
      const scoreKey = `${studentId}_${scoreAssignId}`

      // Update local state for immediate UI feedback
      setScoreChanges((prev) => {
        const next = { ...prev }
        next[scoreKey] = score
        return next
      })

      try {
        await scoreStudent.mutateAsync({
          params: {
            path: {
              yearId: activeYear.id,
              classId: activeClass.id,
              scoreAssignId,
            },
          },
          body: {
            studentId,
            score,
          },
        })
        // Refetch after successful update
        await scoreListQuery.refetch()
      } catch {
        // Remove local change on error
        setScoreChanges((prev) => {
          const newChanges = { ...prev }
          delete newChanges[scoreKey]
          return newChanges
        })
      }
    },
    [activeClass, activeYear, scoreStudent, scoreListQuery],
  )

  const tableData = useMemo<StudentScoreTableRow[]>(() => {
    const scoreAssigns = scoreListQuery.data ?? []

    return (memberQuery.data ?? []).map((member) => {
      const row: StudentScoreTableRow = {
        id: member.id,
        memberId: member.id,
        studentId: member.studentId,
        studentCode: member.student.code,
        studentName: `${member.student.prefix}${member.student.firstName} ${member.student.lastName}`,
      }

      scoreAssigns.forEach((scoreAssign) => {
        row[`score_${scoreAssign.id}`] = getStudentScore(
          member.studentId,
          scoreAssign.id,
        )
        row[`assign_${scoreAssign.id}`] = scoreAssign.name
      })

      return row
    })
  }, [scoreListQuery.data, getStudentScore, memberQuery.data])

  const scoreAssignIds = useMemo(
    () => (scoreListQuery.data ?? []).map((scoreAssign) => scoreAssign.id),
    [scoreListQuery.data],
  )

  const scoreAssignNameMap = useMemo(() => {
    const map = new Map<string, string>()
    ;(scoreListQuery.data ?? []).forEach((scoreAssign) => {
      map.set(scoreAssign.id, scoreAssign.name)
    })
    return map
  }, [scoreListQuery.data])

  const scoreAssignRangeMap = useMemo(() => {
    const map = new Map<string, { minScore: number; maxScore: number }>()
    ;(scoreListQuery.data ?? []).forEach((scoreAssign) => {
      map.set(scoreAssign.id, {
        minScore: scoreAssign.minScore ?? 0,
        maxScore: scoreAssign.maxScore ?? 100,
      })
    })
    return map
  }, [scoreListQuery.data])

  const columns = useMemo<ColumnDef<StudentScoreTableRow>[]>(() => {
    const dynamicScoreColumns: ColumnDef<StudentScoreTableRow>[] = scoreAssignIds.map(
      (assignId) => ({
        id: `score_${assignId}`,
        header: () => scoreAssignNameMap.get(assignId) || 'งาน',
        minSize: 128,
        cell: ({ row }) => {
          const range = scoreAssignRangeMap.get(assignId)
          const minScore = range?.minScore ?? 0
          const maxScore = range?.maxScore ?? 100
          return (
            <Input
              className="[&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden max-w-20 w-full"
              type="number"
              min={minScore}
              max={maxScore}
              value={row.original[`score_${assignId}`] ?? ''}
              onChange={(e) => {
                if (!e.target.value) {
                  onScoreChange(
                    row.original.memberId,
                    row.original.studentId,
                    assignId,
                    minScore,
                  )
                  return
                }

                const parsedScore = parseInt(e.target.value, 10)
                const safeScore = Number.isNaN(parsedScore)
                  ? minScore
                  : Math.min(maxScore, Math.max(minScore, parsedScore))

                onScoreChange(
                  row.original.memberId,
                  row.original.studentId,
                  assignId,
                  safeScore,
                )
              }}
            />
          )
        },
      }),
    )

    return [
      {
        accessorKey: 'studentCode',
        header: 'รหัสนักเรียน',
        size: 80,
      },
      {
        accessorKey: 'studentName',
        header: 'ชื่อนักเรียน',
        minSize: 160,
      },
      ...dynamicScoreColumns,
      {
        id: 'total',
        header: 'รวม',
        cell: ({ row }) => {
          const total = scoreAssignIds.reduce((sum, assignId) => {
            const score = row.original[`score_${assignId}`]
            if (typeof score === 'number') return sum + score
            return sum + (parseInt(score as string, 10) || 0)
          }, 0)

          return <span className="font-semibold">{total}</span>
        },
      },
    ]
  }, [onScoreChange, scoreAssignIds, scoreAssignNameMap, scoreAssignRangeMap])

  return {
    columns,
    tableData,
    isLoading: scoreListQuery.isLoading || memberQuery.isLoading,
    onScoreChange,
  }
}
