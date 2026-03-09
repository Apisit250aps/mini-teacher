'use client'
import React, { useCallback } from 'react'

import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useRouter } from 'next/navigation'
import { Year } from '@/core/domain/entities';
import { YearWithClasses } from '@/core/domain/data';

type YearContextValue = {
  activeYear: YearWithClasses
  years: Year[]
  setYears?: (years: Year[]) => void
  setActiveYear?: (year: YearWithClasses) => void
  onActive: (year: YearWithClasses) => void
}

const YearContext = React.createContext<YearContextValue | null>(null)

export function YearProvider({
  children,
  years,
  activeYear,
}: {
  children: React.ReactNode
  years: Year[]
  activeYear: YearWithClasses
}) {
  const router = useRouter()

  useOverlay()
  //
  const [yearsState, setYears] = React.useState<Year[]>(years)
  const [activeYearState, setActiveYear] = React.useState<YearWithClasses>(activeYear)

  const onActive = useCallback(
    async (year: YearWithClasses) => {
      setActiveYear(year)
      router.replace(`/${year.year}/${year.term}/class`)
    },
    [router],
  )

  return (
    <YearContext.Provider
      value={{
        activeYear: activeYearState,
        years: yearsState,
        setYears,
        setActiveYear,
        onActive,
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
