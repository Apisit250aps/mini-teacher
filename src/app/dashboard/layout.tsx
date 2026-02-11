import { auth } from '@/auth'
import YearLayout from '@/components/layouts/year-layout';
import { initYear } from '@/models/repositories'
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

  return <YearLayout>{children}</YearLayout>
}
