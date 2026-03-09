import React from 'react'
import EmptyPage from '@/presentations/components/share/empty/empty-page'
import { auth } from '@/auth'
import { YearProvider } from '@/hooks/app/use-year'

import { forbidden } from 'next/navigation'
import { yearRepository } from '@/core/repositories'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{
    year: string
    term: string
  }>
}) {
  const session = await auth()
  if (!session) {
    forbidden()
  }

  const { year, term } = await params

  const activeYear = await yearRepository.getUnique(
    session.user.id,
    parseInt(year),
    parseInt(term),
  )

  const years = await yearRepository.getAll({
    where: {
      userId: session.user.id,
    },
  })

  if (!activeYear) {
    return (
      <EmptyPage
        title={'ไม่พบปีการศึกษา'}
        description={'ไม่พบปีการศึกษาที่ตรงกับปีและเทอมที่เลือก'}
      />
    )
  }
  return (
    <YearProvider activeYear={activeYear} years={years}>
      {children}
    </YearProvider>
  )
}
