'use client'
import { Class } from '@/models/entities'
import React from 'react'
import { useClassQueries } from '../queries/use-class'
import { Album } from 'lucide-react'

type ClassContextValue = {
  classes: Class[]
  classRoutes: { name: string; url: string; icon: typeof Album }[]
}

const ClassContext = React.createContext<ClassContextValue | null>(null)

export function ClassProvider({ children }: { children: React.ReactNode }) {
  const { list: classList } = useClassQueries()
  const { data, isPending } = classList

  const classes = React.useMemo(() => {
    if (isPending) return []
    return (data?.data as unknown as Class[]) || []
  }, [data, isPending])

  const classRoutes = React.useMemo(() => {
    return classes.map((cls) => ({
      name: cls.name,
      url: `${cls.id}`,
      icon: Album,
    }))
  }, [classes])

  return (
    <ClassContext.Provider value={{ classes, classRoutes }}>
      {children}
    </ClassContext.Provider>
  )
}

export function useClass() {
  const context = React.useContext(ClassContext)
  if (!context) {
    throw new Error('useClass must be used within a ClassProvider')
  }
  return context
}
