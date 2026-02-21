'use client'

import { useCallback, useMemo, useState } from 'react'
import { useGetClassMembers } from '@/hooks/queries/use-class'
import { useScoreQueries } from '@/hooks/queries/use-score'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'

type StudentScoreTableRow = {
  id: string
  memberId: string
  studentId: string
  studentCode: string
  studentName: string
  [key: string]: string | number
}

type ScoreAssignItem = {
  id: string
  name: string
  minScore: number
  maxScore: number
}

type UseStudentScoreTableResult = {
  scoreAssigns: ScoreAssignItem[]
  tableData: StudentScoreTableRow[]
  isLoading: boolean
  setDraftScore: (
    studentId: string,
    scoreAssignId: string,
    value: string,
  ) => void
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

  const scoreAssigns = useMemo<ScoreAssignItem[]>(
    () =>
      (scoreListQuery.data ?? []).map((scoreAssign) => ({
        id: scoreAssign.id,
        name: scoreAssign.name,
        minScore: scoreAssign.minScore ?? 0,
        maxScore: scoreAssign.maxScore ?? 100,
      })),
    [scoreListQuery.data],
  )

  const tableData = useMemo<StudentScoreTableRow[]>(() => {
    const assignList = scoreListQuery.data ?? []

    return (memberQuery.data ?? []).map((member) => {
      const row: StudentScoreTableRow = {
        id: member.id,
        memberId: member.id,
        studentId: member.studentId,
        studentCode: member.student.code,
        studentName: `${member.student.prefix}${member.student.firstName} ${member.student.lastName}`,
      }

      assignList.forEach((scoreAssign) => {
        row[`score_${scoreAssign.id}`] = getStudentScore(
          member.studentId,
          scoreAssign.id,
        )
        row[`assign_${scoreAssign.id}`] = scoreAssign.name
      })

      return row
    })
  }, [scoreListQuery.data, getStudentScore, memberQuery.data])

  return {
    scoreAssigns,
    tableData,
    isLoading: scoreListQuery.isLoading || memberQuery.isLoading,
    setDraftScore,
    onScoreChange,
  }
}
