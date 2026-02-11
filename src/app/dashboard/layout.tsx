import { auth } from '@/auth'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { YearProvider } from '@/hooks/app/use-year'
import { Year } from '@/models/entities'

import { getYearsByAuthUser, initYear } from '@/models/repositories'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  await initYear(session.user.id)
  const years = (await getYearsByAuthUser(session.user.id)) as Year[]

  return (
    <YearProvider years={years ?? []}>
      <DashboardLayout>{children}</DashboardLayout>
    </YearProvider>
  )
}
