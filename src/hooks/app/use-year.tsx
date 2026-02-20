'use client'
import { Year } from '@/models/entities'
import React, { useCallback } from 'react'
import { useYearQueries } from '@/hooks/queries/use-year'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useRouter } from 'next/navigation'

type YearContextValue = {
  activeYear: Year
  years: Year[]
  setYears?: (years: Year[]) => void
  setActiveYear?: (year: Year) => void
  onActive: (year: Year) => void
}

const YearContext = React.createContext<YearContextValue | null>(null)

export function YearProvider({
  children,
  years,
  activeYear,
}: {
  children: React.ReactNode
  years: Year[]
  activeYear: Year
}) {
  const router = useRouter()
  useYearQueries()
  useOverlay()
  //
  const [yearsState, setYears] = React.useState<Year[]>(years)
  const [activeYearState, setActiveYear] = React.useState<Year>(activeYear)

  const onActive = useCallback(
    async (year: Year) => {
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
