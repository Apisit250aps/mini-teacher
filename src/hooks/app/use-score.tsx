'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useGetClassMembers } from '@/hooks/queries/use-class'
import { useScoreQueries } from '@/hooks/queries/use-score'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import { ScoreInputCell } from '@/components/app/student/score-input-cell'

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
  const [scoreChanges, setScoreChanges] = useState<Record<string, string>>({})

  const getScoreKey = useCallback(
    (studentId: string, scoreAssignId: string) => `${studentId}_${scoreAssignId}`,
    [],
  )

  const setDraftScore = useCallback(
    (studentId: string, scoreAssignId: string, value: string) => {
      const scoreKey = getScoreKey(studentId, scoreAssignId)
      setScoreChanges((prev) => {
        const next = { ...prev }
        next[scoreKey] = value
        return next
      })
    },
    [getScoreKey],
  )

  const getStudentScore = useCallback(
    (studentId: string, scoreAssignId: string) => {
      const scoreKey = getScoreKey(studentId, scoreAssignId)
      const scoreAssign = scoreListQuery.data?.find(
        (item) => item.id === scoreAssignId,
      )
      const scoreData = (
        scoreAssign as typeof scoreAssign & {
          scores?: Array<{ studentId: string; score: number }>
        }
      )?.scores?.find((item) => item.studentId === studentId)

      const draftValue = scoreChanges[scoreKey]
      if (draftValue !== undefined) return draftValue

      return scoreData?.score ?? ''
    },
    [getScoreKey, scoreChanges, scoreListQuery.data],
  )

  const onScoreChange = useCallback(
    async (
      memberId: string,
      studentId: string,
      scoreAssignId: string,
      score: number,
    ) => {
      if (!activeClass || !activeYear) return
      const scoreKey = getScoreKey(studentId, scoreAssignId)

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
      } catch {}

      setScoreChanges((prev) => {
        if (!(scoreKey in prev)) return prev
        const next = { ...prev }
        delete next[scoreKey]
        return next
      })
    },
    [activeClass, activeYear, getScoreKey, scoreStudent, scoreListQuery],
  )

  const onScoreChangeRef = useRef(onScoreChange)
  useEffect(() => {
    onScoreChangeRef.current = onScoreChange
  }, [onScoreChange])

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
            <ScoreInputCell
              value={row.original[`score_${assignId}`] ?? ''}
              minScore={minScore}
              maxScore={maxScore}
              onDraftChange={(value) => {
                setDraftScore(row.original.studentId, assignId, value)
              }}
              onCommit={async (safeScore) => {
                await onScoreChangeRef.current(
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
  }, [
    scoreAssignIds,
    scoreAssignNameMap,
    scoreAssignRangeMap,
    setDraftScore,
  ])

  return {
    columns,
    tableData,
    isLoading: scoreListQuery.isLoading || memberQuery.isLoading,
    onScoreChange,
  }
}
