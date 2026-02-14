'use client'
import { Year } from '@/models/entities'
import React, { useCallback } from 'react'
import { useYearQueries } from '@/hooks/queries/use-year'
import { toast } from 'sonner'
import { useOverlay } from '@/hooks/contexts/use-overlay'

type YearContextValue = {
  activeYear: Year
  years?: Year[]
  setYears?: (years: Year[]) => void
  onSetyearActive: (year: Year) => Promise<void>
  onYearsCreate: (data: { year: string; term: string }) => Promise<void>
}

const YearContext = React.createContext<YearContextValue | null>(null)

export function YearProvider({
  children,
  years,
}: {
  children: React.ReactNode
  years: Year[]
}) {
  const { active, list, create } = useYearQueries()
  const { closeAll } = useOverlay()
  //
  const [yearsState, setYears] = React.useState<Year[]>(years)
  const [activeYear, setActiveYear] = React.useState<Year>(
    years.find((y) => y.isActive) || years[0],
  )

  const onSetyearActive = useCallback(
    async (year: Year) => {
      setActiveYear(year)
      await active.mutateAsync(
        {
          params: {
            path: {
              yearId: year.id,
            },
          },
        },
        {
          onSettled(data, error) {
            if (error) {
              toast.error('เกิดข้อผิดพลาดในการตั้งค่าปีการศึกษา')
              return
            }
            toast.success('ตั้งค่าปีการศึกษาเรียบร้อยแล้ว')
            list.refetch().then((res) => {
              if (res.data?.success && res.data?.data) {
                setYears(
                  res.data.data.map((item) => ({
                    ...item,
                    createdAt: new Date(item.createdAt),
                    updatedAt: new Date(item.updatedAt),
                  })),
                )
              }
            })
          },
        },
      )
    },
    [active, list],
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
        activeYear,
        years: yearsState,
        setYears,
        onSetyearActive,
        onYearsCreate,
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
