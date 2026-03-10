'use client'
import React from 'react'
import { useParams } from 'next/navigation'

import {
  CheckDateWithStudents,
  ClassMemberWithStudent,
  ClassWithMembers,
} from '@/core/domain/data'
import { useYearContext } from './use-year'
import {
  useCheckDatesByClassQuery,
  useClassesByYearQuery,
  useClassMembersByClassQuery,
} from '../queries'

type ClassContextValue = {
  classes: ClassWithMembers[]
  members: ClassMemberWithStudent[]
  checks: CheckDateWithStudents[]
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
  return (
    <ClassContext.Provider
      value={{
        classes: classes ?? [],
        members: members ?? [],
        checks: checks ?? [],
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
