'use client'
import React, { useMemo } from 'react'

import { YearWithClasses } from '@/core/domain/data'
import { useYearsListQuery } from '@/hooks/queries'
import { useSession } from 'next-auth/react'

type YearContextValue = {
  active?: YearWithClasses
  years: YearWithClasses[]
}

type YearProviderProps = {
  children: React.ReactNode
  activeYear?: {
    year: number
    term: number
  }
}

const YearContext = React.createContext<YearContextValue | null>(null)

export function YearProvider({ children, activeYear }: YearProviderProps) {
  const session = useSession()

  const { data: list } = useYearsListQuery({
    where: {
      userId: session.data?.user.id,
    },
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
