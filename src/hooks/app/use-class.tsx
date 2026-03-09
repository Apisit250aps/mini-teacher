'use client'

import React from 'react'
import { Album } from 'lucide-react'
import { useYearContext } from './use-year'
import { Class } from '@/core/domain/entities'

type ClassContextValue = {
  classes: Class[]
  classRoutes: { name: string; url: string; icon: typeof Album }[]
  activeClass?: Class
}

const ClassContext = React.createContext<ClassContextValue | null>(null)

export function ClassProvider({
  children,
  activeClass,
}: {
  children: React.ReactNode
  activeClass?: Class
}) {
  // state
  const { activeYear } = useYearContext()
  const classList = useYearContext().activeYear.classes
  // memo
  const classes = React.useMemo(() => {
    return classList || []
  }, [classList])

  const classRoutes = React.useMemo(() => {
    if (classes.length === 0)
      return [
        {
          name: 'สร้างห้องเรียน',
          url: `/${activeYear.year}/${activeYear.term}/class/manage`,
          icon: Album,
        },
      ]
    return classes.map((cls) => ({
      name: cls.name,
      url: `/${activeYear.year}/${activeYear.term}/class/${cls.id}`,
      icon: Album,
    }))
  }, [classes, activeYear])

  return (
    <ClassContext.Provider
      value={{
        classes,
        classRoutes,
        activeClass,
      }}
    >
      {children}
    </ClassContext.Provider>
  )
}

export function useClassContext() {
  const context = React.useContext(ClassContext)
  if (!context) {
    throw new Error('useClass must be used within a ClassProvider')
  }
  return context
}
