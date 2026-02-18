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
  onActive: (year: Year) => Promise<void>
  onCreate: (data: { year: string; term: string }) => Promise<void>
  onUpdate: (
    yearId: string,
    data: { year: string; term: string },
  ) => Promise<void>
  onRemove: (yearId: string) => Promise<void>
  setActiveYear?: (year: Year) => void
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
  const { create, update, remove } = useYearQueries()
  const { closeAll } = useOverlay()
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

  const onCreate = useCallback(
    async (data: { year: string; term: string }) => {
      await create
        .mutateAsync({
          body: {
            year: Number(data.year),
            term: Number(data.term),
          },
        })
        .then(() => {
          closeAll()
        })
    },
    [create, closeAll],
  )

  const onUpdate = useCallback(
    async (yearId: string, data: { year: string; term: string }) => {
      await update.mutateAsync({
        params: {
          path: { yearId },
        },
        body: {
          year: Number(data.year),
          term: Number(data.term),
        },
      })
    },
    [update],
  )

  const onRemove = useCallback(
    async (yearId: string) => {
      await remove.mutateAsync({
        params: {
          path: { yearId },
        },
      })
    },
    [remove],
  )

  return (
    <YearContext.Provider
      value={{
        activeYear: activeYearState,
        years: yearsState,
        setYears,
        onActive,
        onCreate,
        onUpdate,
        onRemove,
        setActiveYear,
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
