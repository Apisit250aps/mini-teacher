'use client'
import React, { useMemo } from 'react'

import { YearWithClasses } from '@/core/domain/data'
import { useYearsListQuery } from '@/hooks/queries'

type YearContextValue = {
  active?: YearWithClasses
  years: YearWithClasses[]
  teacher: string
}

type YearProviderProps = {
  children: React.ReactNode
  teacherId: string
  activeYear: {
    year: number
    term: number
  }
}

const YearContext = React.createContext<YearContextValue | null>(null)

export function YearProvider({
  children,
  activeYear,
  teacherId,
}: YearProviderProps) {
  const { data: list } = useYearsListQuery({
    where: {
      userId: teacherId,
    },
    orderBy: [{ term: 'desc' }, { year: 'desc' }],
  })

  const active = useMemo(() => {
    if (!activeYear || !list) return undefined
    return list.find(
      (y) => y.year === activeYear.year && y.term === activeYear.term,
    )
  }, [activeYear, list])

  return (
    <YearContext.Provider
      value={{
        active: active,
        years: list ?? [],
        teacher: teacherId,
      }}
    >
      {children}
    </YearContext.Provider>
  )
}

export function useYearContext() {
  const context = React.useContext(YearContext)
  if (!context) {
    throw new Error('useYearContext must be used within a YearProvider')
  }
  return context
}
