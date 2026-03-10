'use client'
import React from 'react'
import { useParams } from 'next/navigation'

import {
  CheckDateWithStudents,
  ClassMemberWithStudent,
  ClassWithMembers,
  ScoreAssignWithScores,
} from '@/core/domain/data'
import { useYearContext } from './use-year'
import {
  useCheckDatesByClassQuery,
  useClassesByYearQuery,
  useClassMembersByClassQuery,
  useScoreAssignsByClassQuery,
} from '../queries'

type ClassContextValue = {
  classes: ClassWithMembers[]
  members: ClassMemberWithStudent[]
  checks: CheckDateWithStudents[]
  assignments: ScoreAssignWithScores[]
  activeClass?: ClassWithMembers
}

const ClassContext = React.createContext<ClassContextValue | null>(null)

export function ClassProvider({ children }: { children: React.ReactNode }) {
  const params = useParams<{ classId?: string }>()
  //
  const { active } = useYearContext()
  //
  const { data: classes } = useClassesByYearQuery(active?.id ?? '')
  const { data: members } = useClassMembersByClassQuery(params.classId ?? '')
  const { data: checks } = useCheckDatesByClassQuery(params.classId ?? '')
  const { data: assignments } = useScoreAssignsByClassQuery(params.classId ?? '')
  return (
    <ClassContext.Provider
      value={{
        classes: classes ?? [],
        members: members ?? [],
        checks: checks ?? [],
        assignments: assignments ?? [],
      }}
    >
      {children}
    </ClassContext.Provider>
  )
}

export function useClassContext() {
  const context = React.useContext(ClassContext)
  if (!context) {
    throw new Error('useClassContext must be used within a ClassProvider')
  }
  return context
}
