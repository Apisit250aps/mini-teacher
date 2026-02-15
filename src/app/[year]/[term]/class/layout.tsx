import { auth } from '@/auth'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import EmptyPage from '@/components/share/empty/empty-page'
import { ClassProvider } from '@/hooks/app/use-class'
import { YearProvider } from '@/hooks/app/use-year'

import { getYearsByAuthUser, getYearsByYearTerm } from '@/models/repositories'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{
    year: string
    term: string
  }>
}>) {
  const session = await auth()
  if (!session) {
    redirect('/login')
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
      <ClassProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </ClassProvider>
    </YearProvider>
  )
}
