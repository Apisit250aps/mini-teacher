'use client'
import { Year } from '@/models/entities'
import React, { useCallback } from 'react'
import { useYearContextQueries } from '@/hooks/queries/use-year'
import { toast } from 'sonner'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useRouter } from 'next/navigation'

type YearContextValue = {
  activeYear: Year
  years?: Year[]
  setYears?: (years: Year[]) => void
  onSetyearActive: (year: Year) => Promise<void>
  onYearsCreate: (data: { year: string; term: string }) => Promise<void>
  setActiveYear?: (year: Year) => void
}

const YearContext = React.createContext<YearContextValue | null>(null)

export function YearProvider({
  children,
  years,
  activeYear,
}: {
  children: React.ReactNode
  years?: Year[]
  activeYear?: Year
}) {
  const router = useRouter()
  const { list, create } = useYearContextQueries()
  const { closeAll } = useOverlay()
  //
  const [yearsState, setYears] = React.useState<Year[]>(years || [])
  const [activeYearState, setActiveYear] = React.useState<Year>(
    activeYear || years![0],
  )

  const onSetyearActive = useCallback(
    async (year: Year) => {
      setActiveYear(year)
      router.push(`/${year.year}/${year.term}/class`)
    },
    [router],
  )

  const onYearsCreate = useCallback(
    async (data: { year: string; term: string }) => {
      await create.mutateAsync(
        {
          body: {
            year: Number(data.year),
            term: Number(data.term),
          },
        },
        {
          onSettled(data, error) {
            if (error) {
              toast.error('เกิดข้อผิดพลาดในการสร้างปีการศึกษา')
              return
            }
            toast.success('สร้างปีการศึกษาเรียบร้อยแล้ว')
            list.refetch().then((res) => {
              if (res.data?.success && res.data?.data && setYears) {
                setYears(
                  res.data.data.map((item) => ({
                    ...item,
                    createdAt: new Date(item.createdAt),
                    updatedAt: new Date(item.updatedAt),
                  })),
                )
              }
            })
            closeAll()
          },
        },
      )
    },
    [create, list, closeAll, setYears],
  )

  return (
    <YearContext.Provider
      value={{
        activeYear: activeYearState,
        years: yearsState,
        setYears,
        onSetyearActive,
        onYearsCreate,
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
