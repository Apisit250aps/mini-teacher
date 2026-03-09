'use client'
import React from 'react'

type AppContext = {
  active?: boolean
}

const AppContext = React.createContext<AppContext | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider
      value={{
        active: true,
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
