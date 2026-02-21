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

type UseStudentScoreTableResult = {
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

      // Update local state for immediate UI feedback
      setScoreChanges((prev) => ({
        ...prev,
        [`${studentId}_${scoreAssignId}`]: score,
      }))

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
          delete newChanges[`${studentId}_${scoreAssignId}`]
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

  return {
    tableData,
    isLoading: scoreListQuery.isLoading || memberQuery.isLoading,
    onScoreChange,
  }
}
