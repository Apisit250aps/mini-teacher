'use client'
import { Year } from '@/models/entities'
import React from 'react'

type YearContextValue = {
  activeYear: Year
  years?: Year[]
  setActiveYear: React.Dispatch<React.SetStateAction<Year>>
  setYears?: (years: Year[]) => void
  onYearsCreate?: (newYear: Year) => Promise<void>
}

const YearContext = React.createContext<YearContextValue | null>(null)

export function YearProvider({
  children,
  years,
}: {
  children: React.ReactNode
  years: Year[]
}) {
  const [yearsState, setYears] = React.useState<Year[]>(years)
  const [activeYear, setActiveYear] = React.useState<Year>(years[0])
  return (
    <YearContext.Provider
      value={{
        activeYear,
        years: yearsState,
        setActiveYear,
        setYears,
      }}
    >
      {children}
    </YearContext.Provider>
  )
}

export function useYear() {
  const context = React.useContext(YearContext)
  if (!context) {
    throw new Error('useYear must be used within a YearProvider')
  }
  return context
}
