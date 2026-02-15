import { auth } from '@/auth';
import { YearProvider } from '@/hooks/app/use-year';
import { getYearsByAuthUser } from '@/models/repositories/year.repo';
import { forbidden } from 'next/navigation';
import React from 'react'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  if (!session) {
    forbidden()
  }
  const years = await getYearsByAuthUser(session.user.id)
  return (
    <YearProvider years={years}>{children}</YearProvider>
  )
}
