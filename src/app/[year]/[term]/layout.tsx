import React from 'react'
import EmptyPage from '@/components/share/empty/empty-page'
import { auth } from '@/auth'
import { YearProvider } from '@/hooks/app/use-year'
import { getYearsByYearTerm, getYearsByAuthUser } from '@/models/repositories/mongo'
import { forbidden } from 'next/navigation'

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

  const activeYear = await getYearsByYearTerm(
    parseInt(year),
    parseInt(term),
    session.user.id,
  )

  const years = await getYearsByAuthUser(session.user.id)

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
