'use client'
import React from 'react'

import { ClassWithMembers } from '@/core/domain/data'
import { useYearContext } from './use-year'
import { useClassesByYearQuery } from '../queries'

type ClassContextValue = {
  classes: ClassWithMembers[]
}

const ClassContext = React.createContext<ClassContextValue | null>(null)

export function ClassProvider({ children }: { children: React.ReactNode }) {
  const { active } = useYearContext()
  const { data } = useClassesByYearQuery(active?.id ?? '')

  return (
    <ClassContext.Provider value={{ classes: data ?? [] }}>
      {children}
    </ClassContext.Provider>
  )
}
