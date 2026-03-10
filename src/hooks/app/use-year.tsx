'use client'
import React, { useMemo } from 'react'

import { YearWithClasses } from '@/core/domain/data'
import { useYearsListQuery } from '@/hooks/queries'
import { useParams } from 'next/navigation'

type YearContextValue = {
  active?: YearWithClasses
  years: YearWithClasses[]
  teacher: string
}

type YearProviderProps = {
  children: React.ReactNode
  teacherId: string
}

const YearContext = React.createContext<YearContextValue | null>(null)

export function YearProvider({
  children,

  teacherId,
}: YearProviderProps) {
  const params = useParams<{ year: string; term: string }>()
  const { data: list } = useYearsListQuery({
    where: {
      userId: teacherId,
    },
    orderBy: [{ term: 'desc' }, { year: 'desc' }],
  })

  const active = useMemo(() => {
    return (
      list.find(
        (y) => y.year === Number(params.year) && y.term === Number(params.term),
      ) ?? list[0]
    )
  }, [params, list])

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
