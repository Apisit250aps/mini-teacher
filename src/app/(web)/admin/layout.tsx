import { auth } from '@/auth'
import AdminLayout from '@/presentations/components/layouts/admin-layout'
import { forbidden } from 'next/navigation'
import React from 'react'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return forbidden()
  }
  return <AdminLayout>{children}</AdminLayout>
}
