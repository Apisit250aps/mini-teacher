'use client'
import React, { useMemo } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

import { ClassWithMembers } from '@/core/domain/data'
import { useYearContext } from './use-year'
import { useClassesByYearQuery } from '../queries'

type ClassContextValue = {
  classes: ClassWithMembers[]
  activeClass?: ClassWithMembers
  isLoading: boolean
}

const ClassContext = React.createContext<ClassContextValue | null>(null)

export function ClassProvider({ children }: { children: React.ReactNode }) {
  const { active } = useYearContext()
  const { data, isLoading } = useClassesByYearQuery(active?.id ?? '')
  const params = useParams<{ classId?: string }>()
  const searchParams = useSearchParams()

  const activeClassId =
    params?.classId ??
    searchParams.get('classId') ??
    searchParams.get('class') ??
    undefined

  const activeClass = useMemo(() => {
    if (!data?.length) return undefined
    if (!activeClassId) return data[0]
    return data.find((item) => item.id === activeClassId) ?? data[0]
  }, [data, activeClassId])

  return (
    <ClassContext.Provider
      value={{ classes: data ?? [], activeClass, isLoading }}
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
