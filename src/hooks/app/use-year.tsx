'use client'
import { Year } from '@/models/entities'
import React, { useCallback } from 'react'
import { useYearQueries } from '../queries/use-year'
import { toast } from 'sonner'

type YearContextValue = {
  activeYear: Year
  years?: Year[]
  onSetyearActive: (year: Year) => Promise<void>
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
  const { active, list } = useYearQueries()
  const [yearsState, setYears] = React.useState<Year[]>(years)
  const [activeYear, setActiveYear] = React.useState<Year>(
    years.find((y) => y.isActive) || years[0],
  )

  const onSetyearActive = useCallback(
    async (year: Year) => {
      setActiveYear(year)
      await active.mutateAsync(
        { yearId: year.id },
        {
          onSettled: (data, error) => {
            if (error) {
              toast.error('Error setting active year')
            }
            toast.success('Active year set successfully')
            list.refetch().then((res) => {
              if (res.data) {
                setYears(res.data)
                setActiveYear(res.data.find((y) => y.isActive) || res.data[0])
              }
            })
          },
        },
      )
    },
    [active, list],
  )

  return (
    <YearContext.Provider
      value={{
        activeYear,
        years: yearsState,
        onSetyearActive,
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
