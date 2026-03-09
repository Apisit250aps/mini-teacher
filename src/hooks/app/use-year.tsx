'use client'
import React from 'react'

import { YearWithClasses } from '@/core/domain/data'

type YearContextValue = {
  activeYear?: YearWithClasses
  years: YearWithClasses[]
}

type YearProviderProps = {
  children: React.ReactNode
  years: YearWithClasses[]
  activeYear?: YearWithClasses
}

const YearContext = React.createContext<YearContextValue | null>(null)

export function YearProvider({
  children,
  years,
  activeYear,
}: YearProviderProps) {
  return (
    <YearContext.Provider
      value={{
        activeYear,
        years,
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
