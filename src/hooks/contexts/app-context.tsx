'use client'
import React from 'react'
import { Year } from '@/models'

type AppContextValue = {
  years?: Year
}

const AppContext = React.createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider
      value={{
        years: undefined,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = React.useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
