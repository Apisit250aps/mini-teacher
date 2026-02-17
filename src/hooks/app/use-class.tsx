'use client'
import { Class } from '@/models/entities'
import React, { useCallback } from 'react'
import { useClassQueries } from '@/hooks/queries/use-class'
import { Album } from 'lucide-react'
import { toast } from 'sonner'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useYearContext } from './use-year'

type ClassContextValue = {
  classes: Class[]
  classRoutes: { name: string; url: string; icon: typeof Album }[]
  activeClass?: Class
  onClassCreate: (data: {
    name: string
    subject: string
    year: string
  }) => Promise<void>
  onClassUpdate: (
    classId: string,
    data: {
      name: string
      subject: string
      year: string
    },
  ) => Promise<void>
  onClassDelete: (classId: string) => Promise<void>
}

const ClassContext = React.createContext<ClassContextValue | null>(null)

export function ClassProvider({
  children,
  activeClass,
}: {
  children: React.ReactNode
  activeClass?: Class
}) {
  const {
    list: classList,
    create: createClass,
    update: updateClass,
    remove: deleteClass,
  } = useClassQueries()
  // state
  const { activeYear } = useYearContext()
  const { data, isPending } = classList
  const { closeAll } = useOverlay()
  // memo
  const classes = React.useMemo(() => {
    if (isPending) return []
    return (data as unknown as Class[]) || []
  }, [data, isPending])

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

  const onClassCreate = useCallback(
    async (data: { name: string; subject: string; year: string }) => {
      await createClass.mutateAsync(
        {
          params: {
            path: {
              yearId: activeYear.id,
            },
          },
          body: {
            name: data.name,
            subject: data.subject,
            year: data.year,
          },
        },
        {
          onSuccess: () => {
            closeAll()
          },
        },
      )
    },
    [activeYear.id, closeAll, createClass],
  )

  const onClassUpdate = useCallback(
    async (
      classId: string,
      data: { name: string; subject: string; year: string },
    ) => {
      await updateClass.mutateAsync(
        {
          params: {
            path: {
              yearId: activeYear.id,
              classId: classId,
            },
          },
          body: {
            name: data.name,
            subject: data.subject,
            year: data.year,
          },
        },
        {
          onSettled(data, error) {
            if (error) {
              toast.error('เกิดข้อผิดพลาดในการอัปเดตชั้นเรียน')
              return
            }
            toast.success('อัปเดตชั้นเรียนเรียบร้อยแล้ว')
            classList.refetch()
            closeAll()
          },
        },
      )
    },
    [activeYear.id, classList, closeAll, updateClass],
  )

  const onClassDelete = useCallback(
    async (classId: string) => {
      await deleteClass.mutateAsync(
        {
          params: {
            path: {
              yearId: activeYear.id,
              classId: classId,
            },
          },
        },
        {
          onSettled(data, error) {
            if (error) {
              toast.error('เกิดข้อผิดพลาดในการลบชั้นเรียน')
              return
            }
            toast.success('ลบชั้นเรียนเรียบร้อยแล้ว')
            classList.refetch()
            closeAll()
          },
        },
      )
    },
    [activeYear.id, classList, closeAll, deleteClass],
  )

  return (
    <ClassContext.Provider
      value={{
        classes,
        classRoutes,
        activeClass,
        onClassCreate,
        onClassUpdate,
        onClassDelete,
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
